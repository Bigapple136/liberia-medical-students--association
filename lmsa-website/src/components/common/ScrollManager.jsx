import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Site-wide scroll behavior for client-side navigation, mounted once in App.
 *
 * React Router does not manage scroll on its own, which previously meant two
 * gaps: hash links (e.g. /membership#apply) landed at the top of the target
 * page, and regular navigation preserved the previous page's scroll offset,
 * dropping users mid-page. This component scrolls to the hash target when one
 * is present, scrolls to the top on PUSH/REPLACE navigation otherwise, and
 * leaves POP (back/forward) alone so the browser's native scroll restoration
 * still works.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Wait a frame so the destination page has rendered its sections.
      const frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' });
      });
      return () => cancelAnimationFrame(frame);
    }
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
    return undefined;
  }, [pathname, hash, navigationType]);

  return null;
}
