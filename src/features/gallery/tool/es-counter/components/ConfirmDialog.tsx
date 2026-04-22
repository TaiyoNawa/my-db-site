// src/features/gallery/tool/es-counter/components/ConfirmDialog.tsx
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { FC, useRef } from 'react';

type Props = {
  isOpen: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export const ConfirmDialog: FC<Props> = ({
  isOpen,
  title,
  body,
  confirmLabel = '削除',
  onConfirm,
  onClose,
}) => {
  // AlertDialog はキャンセルボタンに ref が必要
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="ghost">
              キャンセル
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              ml={3}
            >
              {confirmLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
