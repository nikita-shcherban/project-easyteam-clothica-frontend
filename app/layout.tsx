import 'modern-normalize/modern-normalize.css';
import type { Metadata } from 'next';
import { Nunito_Sans, Inter } from 'next/font/google';
import './globals.css';
import 'izitoast/dist/css/iziToast.min.css';
import Footer from '@/components/Footer/Footer';
import SiteFooter from '@/components/Footer/SiteFooter';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import SaveErrorModal from '@/components/SaveErrorModal/SaveErrorModal';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import Header from '@/components/Header/Header';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Clothica',
    default: 'Clothica',
  },
  description: 'Магазин сучасного одягу Clothica',
  icons: {
    icon: '/favicon.svg',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({
  children,
  modal,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="uk" className={`${nunitoSans.variable} ${inter.variable}`}>
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>
              {children}
              {modal}
            </main>
            <SiteFooter>
              <Footer />
            </SiteFooter>
            <SaveErrorModal />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
