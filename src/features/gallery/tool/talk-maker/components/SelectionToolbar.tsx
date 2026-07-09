// src/features/gallery/tool/talk-maker/components/SelectionToolbar.tsx
import {
  Button,
  Flex,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { AiOutlineCamera, AiOutlineClockCircle } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { Sender } from '../types';
import { normalizeTime } from '../utils/time';

type Props = {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onChangeSender: (sender: Sender) => void;
  onChangeTime: (time: string) => void;
  onDelete: () => void;
  onExportSelected: () => void;
  onExit: () => void;
};

/** 選択モード中に表示する一括操作バー */
export const SelectionToolbar: FC<Props> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onChangeSender,
  onChangeTime,
  onDelete,
  onExportSelected,
  onExit,
}) => {
  const [timeDraft, setTimeDraft] = useState('');
  const toast = useToast();
  const hasSelection = selectedCount > 0;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  const applyTime = (close: () => void) => {
    const normalized = normalizeTime(timeDraft);
    if (!normalized) {
      toast({
        title: '時刻は "12:34" の形式で入力してください',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onChangeTime(normalized);
    setTimeDraft('');
    close();
  };

  return (
    <Flex
      w="100%"
      maxW="380px"
      mx="auto"
      mt={2}
      p={2}
      gap={2}
      align="center"
      wrap="wrap"
      bg="teal.50"
      border="1px solid"
      borderColor="teal.200"
      borderRadius="xl"
    >
      <Text fontSize="xs" fontWeight="bold" color="teal.700" flexShrink={0}>
        {selectedCount}件選択中
      </Text>
      <Button
        size="xs"
        variant="ghost"
        colorScheme="teal"
        onClick={allSelected ? onClearSelection : onSelectAll}
      >
        {allSelected ? '選択解除' : '全選択'}
      </Button>

      <Flex gap={1} ml="auto" wrap="wrap">
        <Button
          size="xs"
          variant="outline"
          colorScheme="teal"
          isDisabled={!hasSelection}
          onClick={() => onChangeSender('other')}
        >
          相手に
        </Button>
        <Button
          size="xs"
          variant="outline"
          colorScheme="teal"
          isDisabled={!hasSelection}
          onClick={() => onChangeSender('me')}
        >
          自分に
        </Button>

        <Popover isLazy>
          {({ onClose }) => (
            <>
              <PopoverTrigger>
                <Button
                  size="xs"
                  variant="outline"
                  colorScheme="teal"
                  leftIcon={<AiOutlineClockCircle />}
                  isDisabled={!hasSelection}
                >
                  時刻
                </Button>
              </PopoverTrigger>
              <PopoverContent w="180px">
                <PopoverArrow />
                <PopoverBody>
                  <Flex gap={2}>
                    <Input
                      size="xs"
                      placeholder="12:34"
                      value={timeDraft}
                      onChange={(e) => setTimeDraft(e.target.value)}
                    />
                    <Button
                      size="xs"
                      colorScheme="teal"
                      onClick={() => applyTime(onClose)}
                    >
                      適用
                    </Button>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>

        <Button
          size="xs"
          variant="outline"
          colorScheme="pink"
          leftIcon={<AiOutlineCamera />}
          isDisabled={!hasSelection}
          onClick={onExportSelected}
        >
          選択部分を保存
        </Button>
        <Button
          size="xs"
          variant="outline"
          colorScheme="red"
          leftIcon={<RiDeleteBin6Line />}
          isDisabled={!hasSelection}
          onClick={onDelete}
        >
          削除
        </Button>
        <Button size="xs" colorScheme="teal" onClick={onExit}>
          完了
        </Button>
      </Flex>
    </Flex>
  );
};
