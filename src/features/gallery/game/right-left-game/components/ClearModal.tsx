import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FC } from 'react';

type ClearModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
};

export const ClearModal: FC<ClearModalProps> = ({
  isOpen,
  onClose,
  onRetry,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          color="green.500"
        >
          🎉 ゲームクリア！ 🎉
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="center">
            <Text fontSize="xl">
              10回連続正解しました！おめでとうございます！
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button colorScheme="pink" onClick={onRetry}>
            もう一度プレイ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
