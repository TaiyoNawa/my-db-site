// src/features/gallery/game/neko-punch/components/ResultPage.tsx
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react';

interface ResultPageProps {
  reactionTime: number | null;
  onRetry: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  reactionTime,
  onRetry,
}) => {
  const [highScore, setHighScore] = useState<number | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isLoadingHighScore, setIsLoadingHighScore] = useState(true); // ハイスコア読み込み中状態を追加

  const highScoreRef = useRef(highScore);
  const isNewHighScoreRef = useRef(isNewHighScore);

  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  useEffect(() => {
    isNewHighScoreRef.current = isNewHighScore;
  }, [isNewHighScore]);

  useEffect(() => {
    // LocalStorageからハイスコアを取得
    const savedHighScore = localStorage.getItem('nekoPunchHighScore');
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
    setIsLoadingHighScore(false); // 読み込み完了
  }, []);

  useEffect(() => {
    if (reactionTime !== null && !isLoadingHighScore) {
      // ハイスコアの更新判定と保存
      const currentHighScore =
        highScoreRef.current !== null ? highScoreRef.current : Infinity;

      if (reactionTime < currentHighScore) {
        setHighScore(reactionTime);
        localStorage.setItem('nekoPunchHighScore', reactionTime.toString());
        setIsNewHighScore(true); // 新記録の場合のみtrueに設定
      } else {
        setIsNewHighScore(false); // 新記録でない場合はfalseに設定
      }
    }
  }, [reactionTime, isLoadingHighScore]); // highScore を依存配列から削除

  return (
    <Box
      textAlign="center"
      cursor="pointer"
      minHeight="60vh" // クリック可能な領域を広げる
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading as="h1" size="xl" mb="20px">
        結果発表！
      </Heading>
      {reactionTime !== null ? (
        <>
          <Text fontSize="2xl" mb="10px">
            あなたの反応速度: {(reactionTime / 1000).toFixed(3)} s
          </Text>
          {isNewHighScore && (
            <Text fontSize="xl" mb="10px">
              ✨新記録ニャ！✨
            </Text>
          )}
        </>
      ) : (
        <Text fontSize="2xl" mb="10px" color="red.500">
          残念！ネコパンチは出なかったニャ...
        </Text>
      )}

      {highScore !== null && (
        <Text fontSize="xl" mb="20px">
          ハイスコア: {(highScore / 1000).toFixed(3)} s
        </Text>
      )}

      <Button colorScheme="blue" size="lg" onClick={onRetry}>
        もう一度遊ぶ
      </Button>
    </Box>
  );
};
