import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // パフォーマンス向上のための設定
  compress: true,
  poweredByHeader: false,
  // Next.js 16 用の設定
  output: 'export', // 静的出力を有効にする
  images: {
    unoptimized: true, // 静的出力では最適化を無効化
  },
};

export default nextConfig;
