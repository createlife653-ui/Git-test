from pathlib import Path
import math
import textwrap

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


BASE_DIR = Path(__file__).resolve().parent
IMAGE_DIR = BASE_DIR / "assets" / "generated-images"
OUTPUT_DIR = BASE_DIR / "exports"
OUTPUT_PATH = OUTPUT_DIR / "tongue-calibration-v01-draft.mp4"

W, H = 1080, 1920
FPS = 24
FONT_PATH = Path("C:/Windows/Fonts/YuGothB.ttc")


SCENES = [
    (0, 3, "Scene1.s.jpg", "コーヒーの味、正直\nよくわからない人へ"),
    (3, 9, "Scene2.png", "プロは味覚を\n楽器みたいにチューニングするらしい"),
    (9, 17, "Scene1.s.jpg", "砂糖・塩・酢を水に溶かして\n試してみました"),
    (17, 25, "Scene3..jpg", "最初は外しました。\nでも、それが面白かった"),
    (25, 34, "Scene3..jpg", "自分の舌のクセが見えると\n味の世界が少し近づきます"),
    (34, 38, "Scene1.s.jpg", "詳しいやり方は\ncoffee-blogへ"),
]


def cover_resize(image, width, height, scale=1.0):
    src_w, src_h = image.size
    ratio = max(width / src_w, height / src_h) * scale
    resized = image.resize((math.ceil(src_w * ratio), math.ceil(src_h * ratio)), Image.Resampling.LANCZOS)
    left = (resized.width - width) // 2
    top = (resized.height - height) // 2
    return resized.crop((left, top, left + width, top + height))


def ease_in_out(t):
    return 0.5 - 0.5 * math.cos(math.pi * t)


def fit_font(draw, lines, font_path, max_width, start_size=76, min_size=44):
    for size in range(start_size, min_size - 1, -2):
        font = ImageFont.truetype(str(font_path), size)
        if all(draw.textbbox((0, 0), line, font=font)[2] <= max_width for line in lines):
            return font
    return ImageFont.truetype(str(font_path), min_size)


def draw_subtitle(frame, text, is_cta=False):
    overlay = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    lines = text.split("\n")
    font = fit_font(draw, lines, FONT_PATH, W - 170, start_size=82 if is_cta else 70)
    line_gap = 18
    line_boxes = [draw.textbbox((0, 0), line, font=font) for line in lines]
    text_h = sum(box[3] - box[1] for box in line_boxes) + line_gap * (len(lines) - 1)
    box_padding_x = 52
    box_padding_y = 34
    box_w = min(W - 90, max(box[2] - box[0] for box in line_boxes) + box_padding_x * 2)
    box_h = text_h + box_padding_y * 2
    box_x = (W - box_w) // 2
    box_y = H - box_h - 142

    draw.rounded_rectangle(
        (box_x, box_y, box_x + box_w, box_y + box_h),
        radius=28,
        fill=(28, 22, 17, 205),
    )

    y = box_y + box_padding_y
    for line, box in zip(lines, line_boxes):
        line_w = box[2] - box[0]
        x = (W - line_w) // 2
        draw.text((x + 2, y + 2), line, font=font, fill=(0, 0, 0, 120))
        draw.text((x, y), line, font=font, fill=(255, 250, 239, 255))
        y += (box[3] - box[1]) + line_gap

    return Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")


def make_frame(image, progress, subtitle, is_cta=False):
    eased = ease_in_out(progress)
    scale = 1.045 + eased * 0.045
    frame = cover_resize(image, W, H, scale=scale)

    # Gentle warm vignette keeps subtitles readable without making the image feel boxed.
    vignette = Image.new("L", (W, H), 0)
    vd = ImageDraw.Draw(vignette)
    vd.ellipse((-290, -140, W + 290, H + 220), fill=210)
    vignette = vignette.filter(ImageFilter.GaussianBlur(90))
    shade = Image.new("RGB", (W, H), (23, 17, 13))
    frame = Image.composite(frame, shade, vignette.point(lambda p: 255 - p // 4))

    if is_cta:
        tint = Image.new("RGBA", (W, H), (0, 0, 0, 80))
        frame = Image.alpha_composite(frame.convert("RGBA"), tint).convert("RGB")

    return draw_subtitle(frame, subtitle, is_cta=is_cta)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    images = {
        name: Image.open(IMAGE_DIR / name).convert("RGB")
        for _, _, name, _ in SCENES
    }

    writer = imageio.get_writer(
        OUTPUT_PATH,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=None,
        ffmpeg_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
    )

    try:
        for start, end, filename, subtitle in SCENES:
            duration = end - start
            total_frames = duration * FPS
            image = images[filename]
            for index in range(total_frames):
                progress = index / max(total_frames - 1, 1)
                frame = make_frame(image, progress, subtitle, is_cta=(end == 38))
                writer.append_data(np.asarray(frame))
    finally:
        writer.close()

    print(OUTPUT_PATH)


if __name__ == "__main__":
    main()
