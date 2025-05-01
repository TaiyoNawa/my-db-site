import { Heading } from '@chakra-ui/react';
import { useState } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';

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
      </SectionWrapper>
    </>
  );
}
