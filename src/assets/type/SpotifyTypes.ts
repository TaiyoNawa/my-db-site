export type Track = {
  //SpotifyTrackItemから、external_urlsをexternal_urls.spotifyに変更した型
  id: string;
  name: string;
  url: string;
};
export type SpotifyTrackItem = {
  //Itemの型
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
};
export type SpotifyTrackResponseItem = {
  //Spotify APIのレスポンスの型
  tracks: {
    items: SpotifyTrackItem[];
  };
};

export type Playlist = {
  id: string;
  name: string;
  url: string;
};
export type SpotifyPlaylistItem = {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
};
export type SpotifyPlaylistResponseItem = {
  playlists: {
    items: SpotifyPlaylistItem[];
  };
};

export type Artist = {
  id: string;
  name: string;
  imageUrl: string; // /画像を取得するためのURL
  url: string; // /Spotifyサイト上でのアーティストのURL
};
export type SpotifyArtistItem = {
  id: string;
  name: string;
  images: {
    url: string;
  }[];
  external_urls: {
    spotify: string;
  };
};
export type SpotifyArtistResponseItem = {
  artists: {
    items: SpotifyArtistItem[];
  };
};
