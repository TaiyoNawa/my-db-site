import { Link } from '@chakra-ui/react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

import { MangaItems } from '@/assets/data/MangaItems';
import { LinkCopyButton } from '@/features/article/components/detail/LinkCopyButton';
import { StackCardList } from '@/features/gallery/components/StackCardList';

export default function Posts() {
  const { isHeaderHidden } = useStickyHeader();

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <LinkCopyButton mb="10" />
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
