import { Link } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { CurrentLinkCopyButton } from '@/components/button/CurrentLinkCopyButton';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { MangaItems } from '@/assets/data/MangaItems';
import { StackCardList } from '@/features/gallery/components/StackCardList';

export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <GalleryMeta
        title="漫画紹介 | Alkyne"
        description="漫画を紹介します"
        ogUrl="/gallery/manga"
        category="漫画"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <CurrentLinkCopyButton mb="10" />
        <ul>
          <li>
            <Link href="https://zenkokushotenin-manga.jp/">参考サイト</Link>
          </li>
          <li>
            <Link href="https://www.reactbits.dev/components/stack">Stack</Link>
          </li>
        </ul>

        <StackCardList mangaItems={MangaItems} />
      </SectionWrapper>
    </>
  );
}
