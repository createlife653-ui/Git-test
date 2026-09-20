import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | Coffee Knowledge',
  description: 'Coffee Knowledgeにおけるアクセス情報の取り扱いについて説明します。',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="section-divider bg-surface-low">
          <div className="max-w-3xl mx-auto px-6 py-16">
            <span className="inline-block font-label text-xs uppercase tracking-widest text-primary/70 mb-4">
              Privacy Policy
            </span>
            <h1 className="font-display font-bold text-display text-primary leading-tight mb-6">
              プライバシーポリシー
            </h1>
            <p className="text-body-lg text-secondary leading-relaxed">
              Coffee Knowledge（以下「当サイト」）における、訪問者の情報の取り扱いについて説明します。
            </p>
            <p className="text-xs text-secondary/60 mt-4 font-label">
              制定日：2026年9月20日
            </p>
          </div>
        </section>

        <section>
          <div className="max-w-3xl mx-auto px-6 py-12 space-y-10 text-secondary leading-relaxed">
            <section>
              <h2 className="font-display font-semibold text-headline-md text-primary mb-4">
                アクセス解析ツールについて
              </h2>
              <p>
                当サイトでは、サイトの利用状況を把握し、内容や使いやすさを改善するために、Googleが提供するアクセス解析ツール「Google Analytics 4」を利用しています。
              </p>
              <p className="mt-4">
                Google Analytics 4はCookieなどの技術を利用して、閲覧したページ、利用日時、おおよその地域、使用した端末やブラウザ、当サイトへの流入元などの情報を収集することがあります。これらの情報は、通常、当サイトが訪問者個人を直接特定できる形では提供されません。
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-headline-md text-primary mb-4">
                情報の利用目的
              </h2>
              <p>収集した情報は、次の目的で利用します。</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>閲覧状況や利用傾向の把握</li>
                <li>記事内容およびサイト構成の改善</li>
                <li>不具合の発見と安定した運営</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-headline-md text-primary mb-4">
                Cookieについて
              </h2>
              <p>
                訪問者は、ブラウザの設定によりCookieを無効にできます。ただし、設定によってはウェブサイトの一部機能が正常に動作しない場合があります。
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-headline-md text-primary mb-4">
                Googleによるデータの取り扱い
              </h2>
              <p>
                Google Analyticsによって収集された情報は、Googleの規約およびプライバシーポリシーに基づいて管理されます。詳細は、Googleの「
                <a
                  href="https://policies.google.com/privacy?hl=ja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4 hover:opacity-70"
                >
                  プライバシーポリシー
                </a>
                」および「
                <a
                  href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4 hover:opacity-70"
                >
                  Google Analytics利用規約
                </a>
                」をご確認ください。
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-headline-md text-primary mb-4">
                外部リンクについて
              </h2>
              <p>
                当サイトから移動した外部サイトにおける情報の取り扱いについて、当サイトは責任を負いません。移動先のサイトが定めるプライバシーポリシーをご確認ください。
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-headline-md text-primary mb-4">
                内容の変更
              </h2>
              <p>
                利用するサービスの変更や法令等への対応に伴い、本ポリシーを改定する場合があります。重要な変更がある場合は、このページでお知らせします。
              </p>
            </section>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-primary hover:opacity-70 transition-opacity"
              >
                ← ホームへ戻る
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
