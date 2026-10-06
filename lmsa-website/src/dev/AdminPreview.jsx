// Dev-only preview entry (T42): renders the admin shell + dashboard with a
// mocked session. Loaded only by admin-preview.html.
import '../dev/mockAuth';
import AppRoutes from '../routes';
import { AuthProvider } from '../context/AuthContext';
import { HashRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';

// Headless verification probe: reports computed responsive state into the
// DOM so `--dump-dom` captures per-viewport facts (dev-only).
function ResponsiveProbe() {
  useEffect(() => {
    const report = () => {
      const sidebar = document.querySelector('main#main-content')?.previousElementSibling;
      const topbar = document.querySelector('header');
      const drawer = document.getElementById('admin-drawer');
      const container = document.querySelector('main#main-content > div');
      const facts = {
        width: window.innerWidth,
        sidebarDisplay: sidebar ? getComputedStyle(sidebar).display : 'missing',
        topbarDisplay: topbar ? getComputedStyle(topbar).display : 'missing',
        drawerTransform: drawer ? getComputedStyle(drawer).transform : 'missing',
        drawerVisibility: drawer ? getComputedStyle(drawer).visibility : 'missing',
        containerMaxWidth: container ? getComputedStyle(container).maxWidth : 'missing',
        containerPadding: container ? getComputedStyle(container).paddingLeft : 'missing',
        mainWidth: document.querySelector('main#main-content')?.getBoundingClientRect().width,
      };
      let el = document.getElementById('responsive-probe');
      if (!el) {
        el = document.createElement('pre');
        el.id = 'responsive-probe';
        el.style.display = 'none';
        document.body.appendChild(el);
      }
      el.textContent = `PROBE:${JSON.stringify(facts)}`;
    };
    report();
    if (window.location.hash.includes('drawer')) {
      setTimeout(() => document.querySelector('header button[aria-controls]')?.click(), 800);
    }
    const t = setTimeout(report, 1500);
    window.addEventListener('resize', report);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', report);
    };
  }, []);
  return null;
}

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <AuthProvider>
      <ResponsiveProbe />
      <AppRoutes />
    </AuthProvider>
  </HashRouter>
);
