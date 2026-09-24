"""Build a standalone atlas from Natural Earth public-domain map data."""
import base64, io, json, urllib.request
from pathlib import Path
from PIL import Image
import numpy as np
from netCDF4 import Dataset

ROOT = Path(__file__).resolve().parent.parent
for name, url in {
    'countries.geojson': 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson',
    'elevation.grd': 'https://oceania.generic-mapping-tools.org/server/earth/earth_relief/earth_relief_06m_p.grd',
}.items():
    if not (ROOT / 'tools' / name).exists():
        urllib.request.urlretrieve(url, ROOT / 'tools' / name)
features = json.loads((ROOT / 'tools/countries.geojson').read_text(encoding='utf-8'))['features']
paths = []
for feature in features:
    geom = feature['geometry']
    polygons = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]
    for polygon in polygons:
        if not any(-42 <= p[1] <= 42 for ring in polygon for p in ring):
            continue
        d = ''
        for ring in polygon:
            d += 'M' + 'L'.join(f'{(lon+180)*4:.2f},{(40-lat)*4+32:.2f}' for lon,lat in ring) + 'Z'
        paths.append(f'<path d="{d}"/>')
with Dataset('elevation', memory=(ROOT / 'tools/elevation.grd').read_bytes()) as data:
    lat = np.asarray(data['lat'][:])
    z = np.asarray(data['z'][:])[(lat > -40) & (lat < 40)][::-1]
    # Pixel registration: 3600 columns over 360 degrees, 800 rows over 80 degrees.
    stops = [0, 500, 1500, 3000, 6000]
    colors = np.array([[244,247,234], [230,236,210], [218,217,189], [197,181,153], [173,153,132]])
    rgba = np.empty((*z.shape,4),dtype=np.uint8)
    for channel in range(3):
        rgba[:,:,channel] = np.interp(z,stops,colors[:,channel])
    rgba[:,:,3] = np.where(z>=0,255,0)
    im=Image.fromarray(rgba)
    buf=io.BytesIO(); im.save(buf,format='PNG',optimize=True)
    terrain=base64.b64encode(buf.getvalue()).decode()
template=(ROOT/'tools/page.html').read_text(encoding='utf-8')
(ROOT/'index.html').write_text(template.replace('<!--COUNTRIES-->',''.join(paths)).replace('__TERRAIN__',terrain),encoding='utf-8')
print('Built standalone index.html')
