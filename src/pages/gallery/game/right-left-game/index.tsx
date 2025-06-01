import {
  Box,
  Button,
  Text,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { ClearModal } from '@/features/gallery/game/right-left-game/components/ClearModal';

const RightLeftGame: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState('右か左を選んでください！');
  const [gameOver, setGameOver] = useState(false);
  const [bestStreak, setBestStreak] = useState(0);
  const { isHeaderHidden } = useStickyHeader();

  const [rightClickTimestamps, setRightClickTimestamps] = useState<number[]>(
    []
  );
  const [leftClickTimestamps, setLeftClickTimestamps] = useState<number[]>([]);
  const [alertDialogMessage, setAlertDialogMessage] = useState('');

  const {
    isOpen: isAlertDialogOpen,
    onOpen: onAlertDialogOpen,
    onClose: onAlertDialogClose,
  } = useDisclosure();

  const {
    isOpen: isClearModalOpen,
    onOpen: onClearModalOpen,
    onClose: onClearModalClose,
  } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBestStreak = localStorage.getItem('rightLeftGameBestStreak');
      if (savedBestStreak) {
        setBestStreak(parseInt(savedBestStreak, 10));
      }
    }
  }, []);

  useEffect(() => {
    if (streak > bestStreak) {
      setBestStreak(streak);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rightLeftGameBestStreak', streak.toString());
      }
    }
  }, [streak, bestStreak]);

  const handleChoice = (choice: 'right' | 'left') => {
    if (gameOver || isAlertDialogOpen || isClearModalOpen) return;

    const now = Date.now();
    let updatedTimestamps: number[];

    if (choice === 'right') {
      updatedTimestamps = [...rightClickTimestamps, now];
      if (updatedTimestamps.length > 25) {
        updatedTimestamps.shift();
      }
      setRightClickTimestamps(updatedTimestamps);
    } else {
      // choice === 'left'
      updatedTimestamps = [...leftClickTimestamps, now];
      if (updatedTimestamps.length > 25) {
        updatedTimestamps.shift();
      }
      setLeftClickTimestamps(updatedTimestamps);
    }

    // Check for rapid clicks (25 clicks in less than 10 seconds) for the chosen direction
    if (
      updatedTimestamps.length === 25 &&
      updatedTimestamps[24] - updatedTimestamps[0] < 10000
    ) {
      setAlertDialogMessage(
        `${choice === 'right' ? '右' : '左'}ばっか連打してない？`
      );
      onAlertDialogOpen();
      return;
    }

    const correctAnswer = Math.random() < 0.5 ? 'right' : 'left';

    if (choice === correctAnswer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak === 10) {
        setMessage('10回連続正解！！ゲームクリア！');
        setGameOver(true);
        onClearModalOpen(); // ゲームクリア時にClearModalを開く
      } else {
        setMessage('正解！');
      }
    } else {
      setMessage(
        `不正解... 正解は${correctAnswer === 'right' ? '右' : '左'}でした。`
      );
      setStreak(0);
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setStreak(0);
    setMessage('右か左を選んでください！');
    setGameOver(false);
    onClearModalClose(); // ClearModalを閉じる
  };

  return (
    <>
      <GalleryMeta
        title="右・左どっち？！ | Haruhate"
        description="右か左か、運試し！"
        ogUrl="/gallery/game/right-left-game"
        category="ゲーム"
      />
      <SecondHeader title="Gallery" isHeaderHidden={isHeaderHidden} />
      <SectionWrapper>
        <Box minH="100vh">
          <Box
            textAlign="center"
            cursor="pointer"
            minHeight="60vh" // クリック可能な領域を広げる
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Heading as="h1" size={{ base: 'lg', md: 'xl' }} mb="20px">
              右・左どっち？！
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} mb="20px">
              現在の連続正解数: {streak}
            </Text>
            <Text fontSize={{ base: 'lg', md: 'xl' }} mb="20px">
              最高記録: {bestStreak}
            </Text>
            <Text mb="20px">{message}</Text>
            <Box
              height={{ base: '40px', sm: '50px' }} // ボタンコンテナに固定の高さを設定
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {!gameOver || isClearModalOpen ? ( // ゲームオーバーかつクリアモーダルが開いていない場合のみボタンを表示
                <Box
                  display="flex"
                  gap={{ base: '10px', sm: '20px' }}
                  flexDirection="row"
                >
                  <Button
                    colorScheme="red"
                    onClick={() => handleChoice('left')}
                    w={{ base: '55px', sm: '120px' }} // 幅をもう一度プレイボタンに合わせる
                  >
                    左
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleChoice('right')}
                    w={{ base: '55px', sm: '120px' }} // 幅をもう一度プレイボタンに合わせる
                  >
                    右
                  </Button>
                </Box>
              ) : (
                <Button
                  w={{ base: '120px', sm: '260px' }}
                  colorScheme="teal"
                  onClick={resetGame}
                >
                  もう一度プレイ
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </SectionWrapper>

      <Modal
        isOpen={isAlertDialogOpen}
        onClose={onAlertDialogClose}
        closeOnOverlayClick={false} // 外側クリックで閉じないようにする
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent mx={1}>
          <ModalHeader fontSize={{ base: 'lg', md: '2xl' }} fontWeight="bold">
            ⚠️警告⚠️
          </ModalHeader>

          <ModalBody color="red.500" fontSize={{ base: 'lg', md: '2xl' }}>
            {alertDialogMessage}
          </ModalBody>

          <ModalFooter>
            <Button
              fontSize={{ base: 'xs', sm: 'lg' }}
              ref={cancelRef}
              onClick={onAlertDialogClose}
            >
              ごめんなさい
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ClearModal
        isOpen={isClearModalOpen}
        onClose={onClearModalClose}
        onRetry={resetGame}
      />
    </>
  );
};

export default RightLeftGame;
