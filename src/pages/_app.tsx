// src/pages/_app.tsx
import { AppProps } from 'next/app';  // Import AppProps dari Next.js
import '../styles/index.css';
import '../styles/landing.css';
import '../styles/login.css';
import '../styles/profile.css';
import '../styles/register.css';
import '../styles/riwayat.css';
import '../styles/sidebar.css';
import '../styles/transaksi.css';

function MyApp({ Component, pageProps }: AppProps) {  // Menambahkan tipe AppProps
  return <Component {...pageProps} />;
}

export default MyApp;