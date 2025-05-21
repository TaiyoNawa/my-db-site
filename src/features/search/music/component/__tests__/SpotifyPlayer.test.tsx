import { describe, it, expect } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { SpotifyPlayer } from '../SpotifyPlayer';

describe('SpotifyPlayer.tsxのテスト', () => {
  it('track タイプの埋め込みを表示する', () => {
    const trackId = 'test_track_id';
    render(<SpotifyPlayer type="track" trackId={trackId} />);

    const iframe = screen.getByTitle('Spotify Embed');
    expect(iframe).toBeInTheDocument();
    expect((iframe as HTMLIFrameElement).src).toContain(
      `https://open.spotify.com/embed/track/${trackId}`
    );
  });

  it('playlist タイプの埋め込みを表示する', () => {
    const playlistId = 'test_playlist_id';
    render(<SpotifyPlayer type="playlist" playlistId={playlistId} />);

    const iframe = screen.getByTitle('Spotify Embed');
    expect(iframe).toBeInTheDocument();
    expect((iframe as HTMLIFrameElement).src).toContain(
      `https://open.spotify.com/embed/playlist/${playlistId}`
    );
  });
});
