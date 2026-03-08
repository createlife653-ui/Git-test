import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // パフォーマンス向上のための設定
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
