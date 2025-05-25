// src/pages/gallery/games/neko-punch/index.tsx
import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { HomePage } from '@/features/gallery/games/neko-punch/components/HomePage';
import { PlayPage } from '@/features/gallery/games/neko-punch/components/PlayPage';
import { ResultPage } from '@/features/gallery/games/neko-punch/components/ResultPage';

type GameState = 'home' | 'play' | 'result';

const NekoPunchGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('home');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const { isHeaderHidden } = useStickyHeader();

  const startGame = () => {
    setGameState('play');
  };

  const endGame = (time: number | null) => {
    setReactionTime(time);
    setGameState('result');
  };

  const retryGame = () => {
    setGameState('home');
    setReactionTime(null);
  };

  return (
    <>
      <GalleryMeta
        title="ネコパンチ！ | Haruhate"
        description="ネコパンチ！をプレイしよう！"
        ogUrl="/gallery/games/neko-punch"
        category="ゲーム"
      />
      <SecondHeader title="Gallery" isHeaderHidden={isHeaderHidden} />
      <SectionWrapper>
        <Box minH="100vh">
          {/* 背景色と最小高さを追加 */}
          {gameState === 'home' && <HomePage onStart={startGame} />}
          {gameState === 'play' && <PlayPage onEnd={endGame} />}
          {gameState === 'result' && (
            <ResultPage reactionTime={reactionTime} onRetry={retryGame} />
          )}
        </Box>
      </SectionWrapper>
    </>
  );
};

export default NekoPunchGame;
