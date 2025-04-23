type SpotifyPlayerProps =
  | { type: 'track'; trackId: string }
  | { type: 'playlist'; playlistId: string };

export const SpotifyPlayer = (props: SpotifyPlayerProps) => {
  const src =
    props.type === 'track'
      ? `https://open.spotify.com/embed/track/${props.trackId}`
      : `https://open.spotify.com/embed/playlist/${props.playlistId}`;

  return (
    <iframe
      title="Spotify Embed"
      src={src}
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
};

export default SpotifyPlayer;
