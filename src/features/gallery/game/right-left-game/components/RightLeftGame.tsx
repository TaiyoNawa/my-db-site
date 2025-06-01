// src/features/gallery/game/right-left-game/components/RightLeftGame.tsx
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

import { ClearModal } from './ClearModal';

export const RightLeftGame: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState('右か左を選んでください！');
  const [gameOver, setGameOver] = useState(false);
  const [bestStreak, setBestStreak] = useState(0);
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
    const saved = localStorage.getItem('rightLeftGameBestStreak');
    if (saved) setBestStreak(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (streak > bestStreak) {
      setBestStreak(streak);
      localStorage.setItem('rightLeftGameBestStreak', streak.toString());
    }
  }, [streak, bestStreak]);

  const handleChoice = (choice: 'right' | 'left') => {
    if (gameOver || isAlertDialogOpen || isClearModalOpen) return;

    const now = Date.now();
    const timestamps =
      choice === 'right' ? rightClickTimestamps : leftClickTimestamps;
    const updated = [...timestamps, now].slice(-25);
    if (choice === 'right') {
      setRightClickTimestamps(updated);
    } else {
      setLeftClickTimestamps(updated);
    }

    if (updated.length === 25 && updated[24] - updated[0] < 10000) {
      setAlertDialogMessage(
        `${choice === 'right' ? '右' : '左'}ばっか連打してない？`
      );
      onAlertDialogOpen();
      return;
    }

    const correct = Math.random() < 0.5 ? 'right' : 'left';
    if (choice === correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak === 10) {
        setMessage('10回連続正解！！ゲームクリア！');
        setGameOver(true);
        onClearModalOpen();
      } else {
        setMessage('正解！');
      }
    } else {
      setMessage(
        `不正解... 正解は${correct === 'right' ? '右' : '左'}でした。`
      );
      setStreak(0);
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setStreak(0);
    setMessage('右か左を選んでください！');
    setGameOver(false);
    onClearModalClose();
  };

  return (
    <>
      <Box
        minH="60vh"
        textAlign="center"
        display="flex"
        flexDir="column"
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
          height={{ base: '40px', sm: '50px' }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {!gameOver || isClearModalOpen ? (
            <Box display="flex" gap={{ base: '10px', sm: '20px' }}>
              <Button
                colorScheme="red"
                onClick={() => handleChoice('left')}
                w={{ base: '55px', sm: '120px' }}
              >
                左
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => handleChoice('right')}
                w={{ base: '55px', sm: '120px' }}
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

      <Modal
        isOpen={isAlertDialogOpen}
        onClose={onAlertDialogClose}
        closeOnOverlayClick={false}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent mx={1}>
          <ModalHeader fontSize={{ base: 'lg', md: '2xl' }}>
            ⚠️警告⚠️
          </ModalHeader>
          <ModalBody color="red.500" fontSize={{ base: 'lg', md: '2xl' }}>
            {alertDialogMessage}
          </ModalBody>
          <ModalFooter>
            <Button
              ref={cancelRef}
              onClick={onAlertDialogClose}
              fontSize={{ base: 'xs', sm: 'lg' }}
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
