'use client';

import { useEffect } from 'react';

export default function HideDevIndicator() {
  useEffect(() => {
    // Function to hide the Next.js dev indicator
    const hideIndicator = () => {
      // Try to find and hide the indicator element
      const indicator = document.getElementById('next-logo');
      if (indicator) {
        const parent = indicator.closest('[id*="devtools"]') || indicator.closest('.nextjs-toast');
        if (parent) {
          (parent as HTMLElement).style.display = 'none';
        }
        indicator.style.display = 'none';
      }

      // Also try to find by other selectors
      const devToolsIndicator = document.getElementById('devtools-indicator');
      if (devToolsIndicator) {
        devToolsIndicator.style.display = 'none';
      }

      // Find any nextjs-portal elements
      const portals = document.querySelectorAll('nextjs-portal, [class*="nextjs-portal"]');
      portals.forEach((portal) => {
        (portal as HTMLElement).style.display = 'none';
      });
    };

    // Run immediately
    hideIndicator();

    // Run after a short delay to catch delayed renders
    const timeout1 = setTimeout(hideIndicator, 100);
    const timeout2 = setTimeout(hideIndicator, 500);
    const timeout3 = setTimeout(hideIndicator, 1000);

    // Set up a mutation observer to watch for the indicator being added
    const observer = new MutationObserver(() => {
      hideIndicator();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      observer.disconnect();
    };
  }, []);

  return null;
}
