// src/pages/_app.tsx
import { AppProps } from 'next/app';  // Import AppProps dari Next.js
import { AppProvider } from '../components/AppContext';  // Import AppProvider
import '../styles/index.css';
import '../styles/landing.css';
import '../styles/login.css';
import '../styles/profile.css';
import '../styles/register.css';
import '../styles/riwayat.css';
import '../styles/sidebar.css';
import '../styles/transaksi.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;