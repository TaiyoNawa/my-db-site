import { Link } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { CurrentLinkCopyButton } from '@/components/button/CurrentLinkCopyButton';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { MangaItems } from '@/assets/data/MangaItems';
import { StackCardList } from '@/features/gallery/manga/StackCardList';

export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <GalleryMeta
        title="マンガ紹介 | Haruhate"
        description="マンガを紹介します"
        ogUrl="/gallery/manga"
        category="マンガ"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <CurrentLinkCopyButton mb="10" />
        <ul>
          <li>
            <Link isExternal={true} href="https://zenkokushotenin-manga.jp/">
              参考サイト
            </Link>
          </li>
        </ul>

        <StackCardList mangaItems={MangaItems} />
      </SectionWrapper>
    </>
  );
}
