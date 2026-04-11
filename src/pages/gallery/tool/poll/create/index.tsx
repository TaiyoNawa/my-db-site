'use client';
// pages/gallery/tool/poll/create/index.tsx
// /gallery/poll/create から /gallery/tool/poll/create に移動済み
import { AddIcon, DragHandleIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import { useState } from 'react';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { SectionWrapper } from '@/components/SectionWrapper';
import { BackButton } from '@/components/button/BackButton';
import { DeleteButton } from '@/components/button/DeleteButton';
import { LinkCopyButton } from '@/components/button/LinkCopyButton';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

type QuestionType = 'single_choice' | 'multiple_choice' | 'slider' | 'text';

type Question = {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  min: number;
  max: number;
  isRequired: boolean;
};

type CreatePollResponse = {
  pollUid: string;
};

type ErrorResponse = {
  message?: string;
};

// --- 選択肢のソータブルアイテム ---
type SortableOptionItemProps = {
  id: string;
  opt: string;
  index: number;
  qId: string;
  canDelete: boolean;
  onChange: (qId: string, i: number, val: string) => void;
  onDelete: (qId: string, i: number) => void;
};

const SortableOptionItem = ({
  id,
  opt,
  index,
  qId,
  canDelete,
  onChange,
  onDelete,
}: SortableOptionItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <HStack ref={setNodeRef} style={style}>
      {/* ドラッグハンドル: クリックイベントが Input に伝わらないよう別要素に分離 */}
      <Box
        cursor="grab"
        flexShrink={0}
        {...attributes}
        {...listeners}
      >
        <DragHandleIcon color="gray.400" />
      </Box>
      <Input
        value={opt}
        onChange={(e) => onChange(qId, index, e.target.value)}
        placeholder={`選択肢 ${index + 1}`}
        bg="white"
      />
      {canDelete && (
        <DeleteButton
          aria-label="選択肢を削除"
          onClick={() => onDelete(qId, index)}
        />
      )}
    </HStack>
  );
};

// --- 質問ブロックのソータブルアイテム ---
type SortableQuestionItemProps = {
  q: Question;
  index: number;
  onRemove: (id: string) => void;
  onChange: (
    id: string,
    field: keyof Question,
    value: string | number | boolean | string[]
  ) => void;
  renderInputs: (q: Question) => React.ReactNode;
};

const SortableQuestionItem = ({
  q,
  index,
  onRemove,
  onChange,
  renderInputs,
}: SortableQuestionItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: q.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      p={4}
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="md"
      bg="pink.50"
      w="100%"
    >
      <HStack mb={4}>
        {/* ドラッグハンドル */}
        <Box cursor="grab" flexShrink={0} {...attributes} {...listeners}>
          <DragHandleIcon color="gray.400" />
        </Box>
        <Text fontWeight="bold">質問 {index + 1}</Text>
        <DeleteButton
          aria-label="質問を削除"
          size="sm"
          onClick={() => onRemove(q.id)}
          ml="auto"
        />
      </HStack>
      <VStack align="stretch" gap={3}>
        <FormControl isRequired>
          <FormLabel>質問文</FormLabel>
          <Input
            value={q.text}
            onChange={(e) => onChange(q.id, 'text', e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>質問形式</FormLabel>
          <Select
            value={q.type}
            onChange={(e) =>
              onChange(q.id, 'type', e.target.value as QuestionType)
            }
            bg="white"
          >
            <option value="single_choice">単一選択</option>
            <option value="multiple_choice">複数選択</option>
            <option value="slider">スライダー</option>
            <option value="text">自由記述</option>
          </Select>
        </FormControl>
        {renderInputs(q)}
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor={`isRequired-${q.id}`} mb="0">
            必須回答にする
          </FormLabel>
          <Switch
            id={`isRequired-${q.id}`}
            colorScheme="pink"
            isChecked={q.isRequired}
            onChange={(e) => onChange(q.id, 'isRequired', e.target.checked)}
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

const CreatePollPageV2 = () => {
  const toast = useToast();
  const { isHeaderHidden } = useStickyHeader();

  // Poll-level state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'全体公開' | '限定公開'>(
    '全体公開'
  );
  const [deadline, setDeadline] = useState<string | null>(null);
  const [deadlinePreset, setDeadlinePreset] = useState('none');

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: nanoid(),
      text: '',
      type: 'single_choice',
      options: ['', ''],
      min: 0,
      max: 100,
      isRequired: false,
    },
  ]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [pollUrl, setPollUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // DnD センサー: 8px動かしてからDnD起動（クリックとの誤爆防止）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const pollImages = [
    'pollImage01.png',
    'pollImage02.jpg',
    'pollImage03.jpg',
    'pollImage04.png',
    'pollImage05.png',
  ];

  // --- Question Handlers ---
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: nanoid(),
        text: '',
        type: 'single_choice',
        options: ['', ''],
        min: 0,
        max: 100,
        isRequired: false,
      },
    ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionChange = (
    id: string,
    field: keyof Question,
    value: string | number | boolean | string[]
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (qId: string, optIndex: number, value: string) => {
    const newQuestions = questions.map((q) => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestions(newQuestions);
  };

  const handleAddOption = (qId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  const handleRemoveOption = (qId: string, optIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          const newOptions = q.options.filter((_, i) => i !== optIndex);
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  // --- DnD Handlers ---
  const handleQuestionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setQuestions((prev) => {
      const oldIndex = prev.findIndex((q) => q.id === active.id);
      const newIndex = prev.findIndex((q) => q.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleOptionDragEnd = (qId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        // IDはインデックスベースで生成するため、現在の並び順から旧/新インデックスを求める
        const optionIds = q.options.map((_, i) => `${q.id}-opt-${i}`);
        const oldIndex = optionIds.indexOf(active.id as string);
        const newIndex = optionIds.indexOf(over.id as string);
        return { ...q, options: arrayMove(q.options, oldIndex, newIndex) };
      })
    );
  };

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPollUrl('');

    // --- Validation for questions and options ---
    for (const q of questions) {
      if (q.type.includes('choice')) {
        // Check for empty options
        if (q.options.some((opt) => opt.trim() === '')) {
          toast({
            title: '空の選択肢があります',
            description: `質問「${q.text || '(無題)'}」の選択肢を確認してください。`,
            status: 'error',
            isClosable: true,
          });
          setIsLoading(false);
          return;
        }

        // Check for duplicate options
        const trimmedOptions = q.options.map((opt) => opt.trim());
        const uniqueOptions = new Set(trimmedOptions);
        if (uniqueOptions.size !== trimmedOptions.length) {
          toast({
            title: '選択肢が重複しています',
            description: `質問「${q.text || '(無題)'}」の選択肢を確認してください。`,
            status: 'error',
            isClosable: true,
          });
          setIsLoading(false);
          return;
        }
      }
    }

    const pollData = {
      title,
      description,
      visibility,
      deadline,
      eyeCatchImage: selectedImage,
      questions: questions.map((q, index) => ({
        text: q.text,
        type: q.type,
        options: q.type.includes('choice')
          ? q.options.filter((opt) => opt.trim() !== '')
          : undefined,
        min: q.type === 'slider' ? q.min : undefined,
        max: q.type === 'slider' ? q.max : undefined,
        isRequired: q.isRequired,
        order: index,
      })),
    };

    try {
      const response = await fetch('/api/poll/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pollData),
      });

      const data = (await response.json()) as
        | CreatePollResponse
        | ErrorResponse;

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(
          errorData.message ||
            'アンケートの作成中に不明なエラーが発生しました。'
        );
      }

      const successData = data as CreatePollResponse;
      // 作成成功後に共有用URLを生成（新URLパスに更新）
      setPollUrl(
        `${window.location.origin}/gallery/tool/poll/${successData.pollUid}`
      );
    } catch (error) {
      console.error('Failed to create poll:', error);
      if (error instanceof Error) {
        toast({
          title: 'エラー',
          description: error.message,
          status: 'error',
          isClosable: true,
        });
      } else {
        toast({
          title: 'エラー',
          description: 'アンケートの作成中に不明なエラーが発生しました。',
          status: 'error',
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestionInputs = (q: Question) => {
    switch (q.type) {
      case 'single_choice':
      case 'multiple_choice': {
        // IDをインデックスベースで生成。ドラッグ後に再採番されるが、
        // handleOptionDragEnd 内でも同じロジックで生成するため整合性が保たれる
        const optionIds = q.options.map((_, i) => `${q.id}-opt-${i}`);
        return (
          <VStack align="stretch" mt={2}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleOptionDragEnd(q.id, event)}
            >
              <SortableContext
                items={optionIds}
                strategy={verticalListSortingStrategy}
              >
                {q.options.map((opt, i) => (
                  <SortableOptionItem
                    key={optionIds[i]}
                    id={optionIds[i]}
                    opt={opt}
                    index={i}
                    qId={q.id}
                    canDelete={q.options.length > 2}
                    onChange={handleOptionChange}
                    onDelete={handleRemoveOption}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {q.options.length < 10 && (
              <Button
                colorScheme="pink"
                size="sm"
                variant="outline"
                onClick={() => handleAddOption(q.id)}
                leftIcon={<AddIcon />}
                _hover={{ bg: 'pink.100' }}
              >
                選択肢を追加
              </Button>
            )}
          </VStack>
        );
      }
      case 'slider':
        return (
          <HStack mt={2} spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm">最小値</FormLabel>
              <Input
                type="number"
                value={q.min}
                onChange={(e) =>
                  handleQuestionChange(
                    q.id,
                    'min',
                    parseInt(e.target.value, 10)
                  )
                }
                bg="white"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">最大値</FormLabel>
              <Input
                type="number"
                value={q.max}
                onChange={(e) =>
                  handleQuestionChange(
                    q.id,
                    'max',
                    parseInt(e.target.value, 10)
                  )
                }
                bg="white"
              />
            </FormControl>
          </HStack>
        );
      case 'text':
        return (
          <Text fontSize="sm" color="gray.500" mt={2}>
            自由記述欄が設置されます。
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <GalleryMeta
        title="アンケート作成 | Haruhate"
        description="新しいアンケートを作成します。"
        ogUrl="/gallery/tool/poll/create"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <VStack
          as="form"
          onSubmit={(e) => void handleSubmit(e)}
          gap={8}
          w="100%"
        >
          <Heading as="h1" size="xl">
            アンケート作成
          </Heading>

          {/* Poll Settings */}
          <VStack w="100%" align="stretch" gap={4}>
            <FormControl isRequired>
              <FormLabel>アンケートタイトル</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                bg="white"
              />
            </FormControl>
            <FormControl>
              <FormLabel>詳しい説明 (任意)</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                bg="white"
              />
            </FormControl>
            <FormControl>
              <FormLabel>公開設定</FormLabel>
              <RadioGroup
                onChange={(v: '全体公開' | '限定公開') => setVisibility(v)}
                value={visibility}
                colorScheme="pink"
              >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="全体公開">全体公開</Radio>
                  <Radio value="限定公開">
                    限定公開 (URLを知っている人のみ)
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>締切日時 (任意)</FormLabel>
              <RadioGroup
                onChange={(value) => {
                  setDeadlinePreset(value);
                  if (value === 'none') {
                    setDeadline(null);
                  } else if (value !== 'custom') {
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
                    setDeadline(now.toISOString());
                  }
                }}
                value={deadlinePreset}
                colorScheme="pink"
              >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="none">なし</Radio>
                  <Radio value="1hour">1時間後</Radio>
                  <Radio value="24hours">24時間後</Radio>
                  <Radio value="1week">1週間後</Radio>
                  <Radio value="custom">日時を指定</Radio>
                </Stack>
              </RadioGroup>
              {deadlinePreset !== 'none' && (
                <Input
                  mt={2}
                  type="datetime-local"
                  bg="white"
                  value={
                    deadline
                      ? new Date(
                          new Date(deadline).getTime() -
                            new Date().getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ''
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      const localDate = new Date(e.target.value);
                      setDeadline(localDate.toISOString());
                      setDeadlinePreset('custom');
                    } else {
                      setDeadline(null);
                    }
                  }}
                />
              )}
            </FormControl>
            <FormControl>
              <FormLabel>アイキャッチ画像 (任意)</FormLabel>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
                {pollImages.map((img) => (
                  <Box
                    key={img}
                    as="button"
                    type="button"
                    onClick={() =>
                      setSelectedImage(selectedImage === img ? null : img)
                    }
                    border="2px solid"
                    borderColor={
                      selectedImage === img ? 'pink.400' : 'gray.200'
                    }
                    borderRadius="md"
                    overflow="hidden"
                    p={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    minH="100px" // 最小高さを設定
                  >
                    <Image
                      src={`/pollImage/${img}`}
                      alt={img}
                      objectFit="cover"
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </FormControl>
          </VStack>

          {/* Questions */}
          <VStack w="100%" align="stretch" gap={6}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleQuestionDragEnd}
            >
              <SortableContext
                items={questions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                {questions.map((q, index) => (
                  <SortableQuestionItem
                    key={q.id}
                    q={q}
                    index={index}
                    onRemove={handleRemoveQuestion}
                    onChange={handleQuestionChange}
                    renderInputs={renderQuestionInputs}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </VStack>

          <Button
            colorScheme="pink"
            variant="outline"
            onClick={handleAddQuestion}
            leftIcon={<AddIcon />}
          >
            質問を追加
          </Button>

          {/* Submission */}
          {!pollUrl ? (
            <Button
              colorScheme="pink"
              type="submit"
              size="lg"
              isLoading={isLoading}
            >
              アンケートを作成
            </Button>
          ) : (
            <VStack
              w="100%"
              mt={4}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg="green.50"
            >
              <Heading as="h2" size="md">
                作成完了！
              </Heading>
              <Text>↓このURLを共有してください↓</Text>
              <LinkCopyButton href={pollUrl} />
            </VStack>
          )}
        </VStack>
        <Box pt={16}>
          <BackButton href="/gallery/tool/poll" colorScheme="pink">
            アンケート一覧に戻る
          </BackButton>
        </Box>
      </SectionWrapper>
    </>
  );
};

export default CreatePollPageV2;
