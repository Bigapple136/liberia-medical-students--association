import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageHero from '../components/common/PageHero';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-lmsa-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-lmsa-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Header />
      <PageHero />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}