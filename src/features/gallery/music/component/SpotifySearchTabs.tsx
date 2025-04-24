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

  return (
    <Tabs variant="enclosed" isFitted>
      <TabList>
        <Tab
          fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
          bgColor="white"
          _selected={{
            borderBottom: '1px',
            color: 'blue.600',
            bg: 'gray.100',
          }}
        >
          楽曲
          <br />
          (Tracks)
        </Tab>
        <Tab
          fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
          bgColor="white"
          _selected={{
            borderBottom: '1px',
            color: 'blue.600',
            bg: 'gray.100',
          }}
        >
          プレイリスト
          <br />
          (Playlists)
        </Tab>
        <Tab
          fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
          bgColor="white"
          _selected={{
            borderBottom: '1px',
            color: 'blue.600',
            bg: 'gray.100',
          }}
        >
          アーティスト
          <br />
          (Artists)
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <SpotifySearchForm onSearch={setTrackKeyword} />
          <SpotifyTrackList keyword={trackKeyword} />
        </TabPanel>
        <TabPanel p={0}>
          <SpotifySearchForm onSearch={setPlaylistKeyword} />
          <SpotifyPlaylistList keyword={playlistKeyword} />
        </TabPanel>
        <TabPanel p={0}>
          <SpotifySearchForm onSearch={setArtistKeyword} />
          <SpotifyArtistList keyword={artistKeyword} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
