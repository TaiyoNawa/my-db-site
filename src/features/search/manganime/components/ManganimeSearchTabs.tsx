// src/features/search/manganime/components/ManganimeSearchTabs.tsx
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useState } from 'react';

import { AnimeList } from './AnimeList';
import { MangaList } from './MangaList';
import { ManganimeSearchForm } from './ManganimeSearchForm'; // 共通の検索フォーム

export const ManganimeSearchTabs = () => {
  const [mangaKeyword, setMangaKeyword] = useState('');
  const [animeKeyword, setAnimeKeyword] = useState('');
  const [mangaResetKey, setMangaResetKey] = useState(0);
  const [animeResetKey, setAnimeResetKey] = useState(0);

  const handleMangaReset = () => {
    setMangaKeyword('');
    setMangaResetKey((prev) => prev + 1); // リセットキー更新
  };
  const handleAnimeReset = () => {
    setAnimeKeyword('');
    setAnimeResetKey((prev) => prev + 1);
  };

  return (
    <Tabs variant="enclosed" isFitted>
      <TabList>
        <Tab
          fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
          bgColor="white"
          _selected={{
            borderBottom: '1px',
            color: 'pink.600',
            bg: 'pink.50',
          }}
        >
          マンガ
          <br />
          (Manga)
        </Tab>
        <Tab
          fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
          bgColor="white"
          _selected={{
            borderBottom: '1px',
            color: 'pink.600',
            bg: 'pink.50',
          }}
        >
          アニメ
          <br />
          (Anime)
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <ManganimeSearchForm
            key={`manga-${mangaResetKey}`}
            onSearch={setMangaKeyword}
          />
          <MangaList keyword={mangaKeyword} onReset={handleMangaReset} />
        </TabPanel>
        <TabPanel p={0}>
          <ManganimeSearchForm
            key={`anime-${animeResetKey}`}
            onSearch={setAnimeKeyword}
          />
          <AnimeList keyword={animeKeyword} onReset={handleAnimeReset} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
