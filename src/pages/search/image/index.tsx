import { Heading } from '@chakra-ui/react';
import { useState } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { SearchMeta } from '@/components/meta/SearchMeta';

import { ImageList } from '@/features/search/image/components/ImageList';
import { ImageSearchForm } from '@/features/search/image/components/ImageSearchForm';
export default function ImageSearchPage() {
  const { isHeaderHidden } = useStickyHeader();
  const [keyword, setKeyword] = useState('');
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setKeyword('');
    setResetKey((prev) => prev + 1);
  };

  return (
    <>
      <SearchMeta
        title="画像 | Haruhate"
        description="画像を検索しましょう"
        ogUrl="/search/image"
        category="画像"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Search" />
      <SectionWrapper>
        <Heading as="h4" fontSize="2xl" mb={2}>
          探す（Find）
        </Heading>
        <ImageSearchForm key={`form-${resetKey}`} onSearch={setKeyword} />
        <ImageList
          key={`list-${resetKey}`}
          keyword={keyword}
          onReset={handleReset}
        />
        {/* ↓フォームをリセットするために key プロパティを使用して強制的に再マウントすることは効果的ですが、
        将来的にさらに複雑な状態管理が必要になった場合に完全な再マウントを回避するために、コンポーネント内でリセット状態を管理することを検討してください。
        <ImageSearchForm reset={reset} onSearch={setKeyword} />
        <ImageList
          keyword={keyword}
          reset={reset}
          onReset={handleReset}
        /> */}
      </SectionWrapper>
    </>
  );
}
