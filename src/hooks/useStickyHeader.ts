import { useEffect, useState } from 'react';

import { HEADER_HEIGHT } from '@/components/header/assets/data';

export const useStickyHeader = () => {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderHidden(currentScrollY >= HEADER_HEIGHT); //Hederの高さ以上スクロールしたら
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isHeaderHidden };
};
