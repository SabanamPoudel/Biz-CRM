'use client';

import { useSplash } from '../contexts/SplashContext';
import SplashScreen from './SplashScreen';

export default function GlobalSplashScreen() {
  const { showSplash, setSplashShown } = useSplash();

  if (!showSplash) return null;

  return (
    <SplashScreen
      onComplete={setSplashShown}
      duration={2500} // 2.5 seconds for initial load
    />
  );
}