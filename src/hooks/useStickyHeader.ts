import { useEffect, useState } from 'react';

import { HEADER_HEIGHT } from '@/assets/data/HeaderAssets';

export const useStickyHeader = () => {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderHidden(currentScrollY >= HEADER_HEIGHT); //Headerの高さ以上スクロールしたら
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isHeaderHidden };
};
