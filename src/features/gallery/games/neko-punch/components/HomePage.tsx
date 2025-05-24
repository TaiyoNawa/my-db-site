// src/features/gallery/games/neko-punch/components/HomePage.tsx
import {
  Box,
  Button,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

interface HomePageProps {
  onStart: () => void;
  highScore?: number | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const [highScore, setHighScore] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // LocalStorageからハイスコアを取得
    const savedHighScore = localStorage.getItem('nekoPunchHighScore');
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
  }, []);

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
        ネコパンチ！一番反射が早いのは誰ニャ？
      </Heading>
      {highScore !== null && (
        <Text fontSize="xl" mb="20px">
          ハイスコア: {(highScore / 1000).toFixed(3)} s
        </Text>
      )}
      <Button colorScheme="blue" size="lg" onClick={onStart} mb="20px">
        スタート
      </Button>
      <Text
        onClick={onOpen}
        _hover={{ textDecoration: 'underline' }}
        fontWeight="bold"
      >
        ルール説明
      </Text>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: 'xs', sm: 'sm', md: 'xl' }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ルール説明</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              画面にネコの手(🐾)が表示されたら、黒枠内を素早くクリックしてください。反応速度が計測されます。
            </Text>
            <Text>ネコの手が表示される前にクリックすると失敗です。</Text>
            <Text>フェイント(🐶など)に騙されないように注意してください。</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
