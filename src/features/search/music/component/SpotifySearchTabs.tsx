import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useState } from 'react';

import { SpotifyArtistList } from './SpotifyArtistList';
import { SpotifyPlaylistList } from './SpotifyPlaylistList';
import { SpotifySearchForm } from './SpotifySearchForm';
import { SpotifyTrackList } from './SpotifyTrackList';

export const SpotifySearchTabs = () => {
  const [trackKeyword, setTrackKeyword] = useState('');
  const [playlistKeyword, setPlaylistKeyword] = useState('');
  const [artistKeyword, setArtistKeyword] = useState('');
  const [trackResetKey, setTrackResetKey] = useState(0);
  const [playlistResetKey, setPlaylistResetKey] = useState(0);
  const [artistResetKey, setArtistResetKey] = useState(0);

  const handleTrackReset = () => {
    setTrackKeyword('');
    setTrackResetKey((prev) => prev + 1); // リセットキー更新 → propsの変更で再レンダーをトリガー
  };
  const handlePlaylistReset = () => {
    setPlaylistKeyword('');
    setPlaylistResetKey((prev) => prev + 1);
  };
  const handleArtistReset = () => {
    setArtistKeyword('');
    setArtistResetKey((prev) => prev + 1);
  };
  return (
    <Tabs variant="enclosed" isFitted>
      <TabList overflowX="auto" overflowY="hidden">
        <Tab
          fontSize={{ base: '11px', sm: 'sm', md: 'md' }}
          bgColor="white"
          _selected={{
            borderBottom: '1px',
            color: 'pink.600',
            bg: 'pink.50',
          }}
        >
          楽曲
          <br />
          (Tracks)
        </Tab>
        <Tab
          fontSize={{ base: '11px', sm: 'sm', md: 'md' }}
          bgColor="white"
          _selected={{
            borderBottom: '1px',
            color: 'pink.600',
            bg: 'pink.50',
          }}
        >
          プレイリスト
          <br />
          (Playlists)
        </Tab>
        <Tab
          fontSize={{ base: '11px', sm: 'sm', md: 'md' }}
          bgColor="white"
          _selected={{
            borderBottom: '1px',
            color: 'pink.600',
            bg: 'pink.50',
          }}
        >
          アーティスト
          <br />
          (Artists)
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <SpotifySearchForm
            key={`track-${trackResetKey}`} // keyを変更すると内部stateも初期化される
            onSearch={setTrackKeyword}
          />
          <SpotifyTrackList keyword={trackKeyword} onReset={handleTrackReset} />
        </TabPanel>
        <TabPanel p={0}>
          <SpotifySearchForm
            key={`playlist-${playlistResetKey}`}
            onSearch={setPlaylistKeyword}
          />
          <SpotifyPlaylistList
            keyword={playlistKeyword}
            onReset={handlePlaylistReset}
          />
        </TabPanel>
        <TabPanel p={0}>
          <SpotifySearchForm
            key={`artist-${artistResetKey}`}
            onSearch={setArtistKeyword}
          />
          <SpotifyArtistList
            keyword={artistKeyword}
            onReset={handleArtistReset}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
