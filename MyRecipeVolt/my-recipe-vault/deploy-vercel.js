const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting Vercel deployment...');

try {
  // Vercel CLIでデプロイ
  const output = execSync('vercel --prod --yes', {
    encoding: 'utf8',
    stdio: 'inherit'
  });

  console.log('Deployment output:', output);

  // デプロイURLを抽出
  const lines = output.split('\n');
  let deployUrl = null;

  for (const line of lines) {
    if (line.includes('https://') && line.includes('.vercel.app')) {
      deployUrl = line.trim();
      break;
    }
  }

  if (deployUrl) {
    console.log('Deployment URL:', deployUrl);
    fs.writeFileSync('deploy-url.txt', deployUrl);
  } else {
    console.log('Could not find deployment URL in output');
  }

} catch (error) {
  console.error('Deployment error:', error.message);
  process.exit(1);
}
