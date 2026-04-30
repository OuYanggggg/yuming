import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: '一段记忆的归处 | Domain Countdown',
  description: 'A minimalist countdown to the release of this domain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0a0a0c] text-white antialiased selection:bg-white/20 selection:text-white min-h-[100dvh] flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
