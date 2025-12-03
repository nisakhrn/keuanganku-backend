// src/pages/_app.tsx
import { AppProps } from 'next/app';  // Import AppProps dari Next.js
import { AppProvider } from '../src/components/AppContext';  // => perbaikan path
import '../styles/layout.css';
import '../styles/index.css';
import '../styles/landing.css';
import '../styles/login.css';
import '../styles/profile.css';
import '../styles/register.css';
import '../styles/dashboard.css';
import '../styles/riwayat.css';
import '../styles/sidebar.css';
import '../styles/transaksi.css';
import '../styles/globals.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;