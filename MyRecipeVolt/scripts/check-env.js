#!/usr/bin/env node

/**
 * 環境互換性チェックスクリプト
 * Node.jsとnpmのバージョンがプロジェクト要件を満たしているかを確認
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkNodeVersion() {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );

  const nodeVersion = process.version.replace('v', '');
  const requiredVersion = packageJson.engines.node;

  log('\n📦 環境互換性チェック', 'cyan');
  log('='.repeat(40), 'cyan');

  // Node.jsバージョンチェック
  log(`\nNode.js:`, 'cyan');
  log(`  現在のバージョン: ${nodeVersion}`, 'reset');
  log(`  必要なバージョン: ${requiredVersion}`, 'reset');

  // Node.js v24は新しすぎるため警告
  const majorVersion = parseInt(nodeVersion.split('.')[0]);
  if (majorVersion > 20) {
    log(`  ⚠️  警告: Node.js v${majorVersion}は新しすぎます。Vercelで問題が発生する可能性があります。`, 'yellow');
    log(`  💡 推奨: Node.js v20.xを使用してください。`, 'yellow');
  } else {
    log(`  ✅ Node.jsバージョンは適切です`, 'green');
  }

  // npmバージョンチェック
  log(`\nnpm:`, 'cyan');
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log(`  現在のバージョン: ${npmVersion}`, 'reset');
    log(`  ✅ npmは最新版です`, 'green');
  } catch (error) {
    log(`  ❌ npmのバージョンを確認できません`, 'red');
  }

  // .nvmrcの存在チェック
  log(`\n.nvmrc:`, 'cyan');
  const nvmrcPath = path.join(process.cwd(), '.nvmrc');
  if (fs.existsSync(nvmrcPath)) {
    const nvmrcVersion = fs.readFileSync(nvmrcPath, 'utf8').trim();
    log(`  推奨バージョン: ${nvmrcVersion}`, 'reset');
    log(`  ✅ .nvmrcファイルが存在します`, 'green');
  } else {
    log(`  ⚠️  警告: .nvmrcファイルが存在しません`, 'yellow');
    log(`  💡 .nvmrcファイルを作成して、チームでNode.jsのバージョンを統一してください`, 'yellow');
  }

  // 重要なパッケージのバージョンチェック
  log(`\n重要なパッケージ:`, 'cyan');
  log(`  Next.js: ${packageJson.dependencies.next}`, 'reset');
  log(`  React: ${packageJson.dependencies.react}`, 'reset');
  log(`  eslint-config-next: ${packageJson.devDependencies['eslint-config-next']}`, 'reset');

  log('\n' + '='.repeat(40), 'cyan');
  log('チェック完了', 'cyan');
  log('\n💡 ヒント: Node.jsのバージョンを切り替える場合:', 'yellow');
  log('   nvm use 20  # nvmを使用している場合', 'yellow');
  log('   volta pin 20  # voltaを使用している場合', 'yellow');
  log('   n 20  # nを使用している場合', 'yellow');
  log('\n', 'reset');
}

checkNodeVersion();
