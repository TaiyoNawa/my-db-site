// src/features/gallery/games/neko-punch/components/PlayPage.tsx
import { Box, Text } from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';
import React, { useState, useEffect, useRef } from 'react';

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const blinkingText = css`
  animation: ${blink} 1s linear infinite;
`;

interface PlayPageProps {
  onEnd: (reactionTime: number | null) => void;
}

export const PlayPage: React.FC<PlayPageProps> = ({ onEnd }) => {
  const [gameState, setGameState] = useState<
    'countdown' | 'wait' | 'show' | 'penalty'
  >('countdown');
  const [countdown, setCountdown] = useState(3);
  const [showCat, setShowCat] = useState(false);
  const [fakeAnimal, setFakeAnimal] = useState<string | null>(null);

  const startTimeRef = useRef<number>(0);
  const fakeCountRef = useRef<number>(0); // 表示済みフェイント数

  useEffect(() => {
    if (gameState === 'countdown') {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(timer);
        setGameState('wait');
      }

      return () => clearInterval(timer);
    } else if (gameState === 'wait') {
      const randomDelay = Math.random() * 7000 + 1000; // 1〜8秒の遅延
      const fakeAnimals = [
        '🐶',
        '🐘',
        '🦊',
        '🐸',
        '🦁',
        '🐵',
        '🐼',
        '🐨',
        '🐷',
        '🐮',
        '🐔',
        '🐧',
        '🦉',
        '🦄',
        '🐲',
        '🐍',
        '🦖',
        '🦕',
        '🦀',
        '🦑',
        '🐙',
        '🦞',
        '🦐',
        '🦦',
        '🦥',
        '🦔',
        '🦓',
        '🦒',
        '🦘',
        '🦛',
        '🐢',
        '🐦',
        '🐤',
        '🐣',
        '🐺',
        '🦝',
        '🦡',
        '🦨',
        '🦩',
        '🦚',
        '🦜',
        '🦢',
        '🦆',
        '🦃',
        '🦔',
        '🐿️',
        '🦫',
        '🦦',
        '🦭',
        '🦈',
      ];
      let fakeInterval: NodeJS.Timeout | null = null;

      fakeCountRef.current = 0;

      // フェイントを1秒後からランダムで最大7回まで表示
      const startFakeSequence = () => {
        fakeInterval = setInterval(() => {
          if (fakeCountRef.current >= 7) return;
          if (Math.random() < 1 / 3) {
            const randomFake =
              fakeAnimals[Math.floor(Math.random() * fakeAnimals.length)];
            setFakeAnimal(randomFake);
            setTimeout(() => setFakeAnimal(null), 500);
            fakeCountRef.current += 1;
          }
        }, 1000); // 1秒ごとに判定（最大6回程度可能）
      };

      const fakeStartTimer = setTimeout(() => {
        startFakeSequence();
      }, 1000); // 1秒後に開始

      const showTimer = setTimeout(() => {
        setGameState('show');
        setShowCat(true);
        startTimeRef.current = performance.now();
        if (fakeInterval) clearInterval(fakeInterval);
      }, randomDelay);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(fakeStartTimer);
        if (fakeInterval) clearInterval(fakeInterval);
      };
    }
  }, [gameState, countdown]);

  const handleClick = () => {
    if (gameState === 'show') {
      const reactionTime = performance.now() - startTimeRef.current;
      onEnd(reactionTime);
    } else if (gameState === 'wait' || gameState === 'countdown') {
      setGameState('penalty');
      setTimeout(() => {
        onEnd(null); // ペナルティ時は null を返す
      }, 1000);
    }
  };

  return (
    <Box
      textAlign="center"
      onClick={handleClick}
      cursor="pointer"
      minHeight="60vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      border={'1px solid black'}
    >
      {gameState === 'countdown' && <Text fontSize="6xl">{countdown}</Text>}

      {gameState === 'wait' && (
        <>
          <Text fontSize="xl" css={blinkingText}>
            ネコパンチを待て！
          </Text>
          {fakeAnimal && <Text fontSize="6xl">{fakeAnimal}</Text>}
        </>
      )}

      {gameState === 'show' && showCat && <Text fontSize="6xl">🐾</Text>}

      {gameState === 'penalty' && (
        <Box>
          <Text fontSize="xl" color="red.500">
            早すぎるニャ！
          </Text>
          <Text fontSize="6xl">😾</Text>
        </Box>
      )}
    </Box>
  );
};
