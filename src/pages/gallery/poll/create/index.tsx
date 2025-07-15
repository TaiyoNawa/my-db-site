import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import React from 'react'; // Import React for event types

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { LinkCopyButton } from '@/components/button/LinkCopyButton'; // Import LinkCopyButton
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

// Define the expected response type from the API
interface CreatePollResponse {
  pollUid: string;
}

const CreatePollPage = () => {
  const { isHeaderHidden } = useStickyHeader();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [deadlinePreset, setDeadlinePreset] = useState('none');
  const [customDeadline, setCustomDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pollUrl, setPollUrl] = useState('');

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLDivElement>) => {
    // Changed event type to HTMLDivElement
    e.preventDefault();
    setIsLoading(true);
    setPollUrl('');

    // Basic validation
    if (
      !title.trim() ||
      options.some((opt) => !opt.trim()) ||
      options.length < 2
    ) {
      alert('タイトルと2つ以上の選択肢は必須です。');
      setIsLoading(false);
      return;
    }

    let deadlineValue: string | null = null;
    if (deadlinePreset !== 'none') {
      const now = new Date();
      switch (deadlinePreset) {
        case '1hour':
          now.setHours(now.getHours() + 1);
          deadlineValue = now.toISOString();
          break;
        case '24hours':
          now.setDate(now.getDate() + 1);
          deadlineValue = now.toISOString();
          break;
        case '1week':
          now.setDate(now.getDate() + 7);
          deadlineValue = now.toISOString();
          break;
        case 'custom':
          if (customDeadline) {
            deadlineValue = new Date(customDeadline).toISOString();
          }
          break;
        default:
          deadlineValue = null;
      }
    }

    const pollData = {
      title,
      description,
      options: options.filter((opt) => opt.trim() !== ''),
      deadline: deadlineValue,
    };

    try {
      const response = await fetch('/api/poll/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = (await response.json()) as CreatePollResponse; // Cast response to CreatePollResponse type
      setPollUrl(`${window.location.origin}/gallery/poll/${data.pollUid}`);
      // Redirect to the poll page after creation (optional, can show URL first)
      // window.location.href = `/poll/${data.pollUid}`;
    } catch (error) {
      console.error('Failed to create poll:', error);
      alert('アンケートの作成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <GalleryMeta
          title="アンケート作成 | Haruhate"
          description="アンケートを作成しよう"
          ogUrl="/gallery/poll/create"
          category="ギャラリー"
        />
        <VStack
          gap={6}
          as="form"
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
        >
          <Heading as="h1" size="xl">
            アンケート作成
          </Heading>

          {/* アンケートタイトル */}
          <Box w="100%">
            <label htmlFor="title">アンケートタイトル</label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 夏休みの旅行先アンケート！"
              mt={1} // Add some margin top for spacing
            />
          </Box>

          {/* 詳しい説明 */}
          <Box w="100%">
            <label htmlFor="description">詳しい説明 (任意)</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="補足情報など"
              mt={1} // Add some margin top for spacing
            />
          </Box>

          {/* 投票選択肢 */}
          <Box w="100%">
            <label htmlFor="options">投票選択肢 (2個以上10個以下)</label>
            <VStack gap={3} align="stretch" mt={1}>
              {' '}
              {/* Add margin top */}
              {options.map((option, index) => (
                <HStack key={index}>
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`選択肢 ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <Button
                      aria-label="Remove option"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <DeleteIcon />
                      削除
                    </Button>
                  )}
                </HStack>
              ))}
              {options.length < 10 && ( // Limit to 10 options for now as per spec
                <Button
                  onClick={handleAddOption}
                  size="sm"
                  alignSelf="flex-start"
                >
                  選択肢を追加
                </Button>
              )}
            </VStack>
          </Box>

          {/* 締め切り日時 */}
          <Box w="100%">
            <label>締め切り日時 (任意)</label>
            <RadioGroup
              onChange={(value) => {
                setDeadlinePreset(value);
                if (value !== 'none') {
                  const now = new Date();
                  switch (value) {
                    case '1hour':
                      now.setHours(now.getHours() + 1);
                      break;
                    case '24hours':
                      now.setDate(now.getDate() + 1);
                      break;
                    case '1week':
                      now.setDate(now.getDate() + 7);
                      break;
                  }
                  if (value !== 'custom') {
                    const now = new Date();
                    switch (value) {
                      case '1hour':
                        now.setHours(now.getHours() + 1);
                        break;
                      case '24hours':
                        now.setDate(now.getDate() + 1);
                        break;
                      case '1week':
                        now.setDate(now.getDate() + 7);
                        break;
                    }

                    // JSTに変換してdatetime-local表示に使う
                    const offset = now.getTimezoneOffset();
                    const jst = new Date(now.getTime() - offset * 60 * 1000);
                    const japanDateTime = jst.toISOString().slice(0, 16);
                    setCustomDeadline(japanDateTime);
                  }
                }
              }}
              value={deadlinePreset}
              mt={1}
            >
              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                <Radio value="none">なし</Radio>
                <Radio value="1hour">1時間後</Radio>
                <Radio value="24hours">24時間後</Radio>
                <Radio value="1week">1週間後</Radio>
                <Radio value="custom">日時を指定</Radio>
              </Stack>
            </RadioGroup>

            {/* 締切日付の編集フィールドは常に表示 */}
            {deadlinePreset !== 'none' && (
              <Input
                mt={2}
                type="datetime-local"
                value={customDeadline}
                onChange={(e) => setCustomDeadline(e.target.value)}
              />
            )}
          </Box>

          {!pollUrl && (
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={isLoading}
            >
              アンケートを作成
            </Button>
          )}

          {pollUrl && (
            <VStack w="100%" mt={3} p={4}>
              <Heading as="h2" size="md" mt={4} mb={2}>
                アンケートを作成しました！
              </Heading>
              <Text>↓アンケートのリンクをコピーして共有する↓</Text>
              <LinkCopyButton href={pollUrl} />
            </VStack>
          )}
        </VStack>
      </SectionWrapper>
    </>
  );
};

export default CreatePollPage;
