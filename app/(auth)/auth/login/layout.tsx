import type { ReactNode } from 'react';
import { Inter, Nunito_Sans } from 'next/font/google';
import 'izitoast/dist/css/iziToast.min.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});
const nunitoSans = Nunito_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-nunito-sans',
  display: 'swap',
  axes: ['YTLC', 'wdth'],
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} ${nunitoSans.variable}`}>{children}</div>
  );
}
