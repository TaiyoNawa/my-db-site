'use client';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Textarea,
  VStack,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SectionWrapper } from '@/components/SectionWrapper';
import { BackButton } from '@/components/button/BackButton';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

// --- Types ---
interface QuestionData {
  questionUid: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'slider' | 'text';
  options?: string[];
  min?: number;
  max?: number;
  isRequired: boolean;
}

type PollData = {
  pollUid: string;
  title: string;
  description: string;
  questions: QuestionData[];
  deadline: string | null;
  hasVoted: boolean;
};

type SubmitResponse = {
  message: string;
};

type ErrorResponse = {
  message?: string;
};

type AnswersState = {
  [questionUid: string]: string | string[] | number;
};

const fetcher = async (url: string): Promise<PollData> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json() as Promise<PollData>;
};

const PollPage = () => {
  const { isHeaderHidden } = useStickyHeader();
  const router = useRouter();
  const { pollUid } = router.query;
  const toast = useToast();

  const [answers, setAnswers] = useState<AnswersState>({});
  const [voterId, setVoterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  const { data: poll, error } = useSWR<PollData>(
    pollUid && typeof pollUid === 'string' && voterId
      ? `/api/poll/${pollUid}?voterId=${voterId}`
      : null,
    fetcher
  );

  useEffect(() => {
    let id = Cookies.get('voterId');
    if (!id) {
      id = nanoid();
      Cookies.set('voterId', id, { expires: 365 });
    }
    setVoterId(id);
  }, []);

  useEffect(() => {
    if (!poll || !router.isReady) return;

    const isDeadlinePassed =
      poll.deadline && new Date() > new Date(poll.deadline);

    if (isDeadlinePassed) {
      const resultsUrl = `/gallery/poll/${poll.pollUid}/results`;
      void router.push(resultsUrl);
    } else if (poll.hasVoted) {
      const resultsUrl = `/gallery/poll/${poll.pollUid}/results`;
      void router.push(resultsUrl);
    } else {
      // No redirect needed, the page is ready to be displayed.
      setIsPageReady(true);
    }
  }, [poll, router]);

  const handleAnswerChange = (
    questionUid: string,
    value: string | string[] | number
  ) => {
    setAnswers((prev) => ({ ...prev, [questionUid]: value }));
  };

  const handleSubmit = async () => {
    if (!voterId) {
      toast({ title: 'Voter ID not found.', status: 'error' });
      return;
    }

    // Validation
    for (const q of poll?.questions || []) {
      if (q.isRequired && !answers[q.questionUid]) {
        toast({
          title: `「${String(q.text)}」は必須回答です。`,
          status: 'warning',
          isClosable: true,
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/poll/${String(pollUid)}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterId,
          answers: Object.entries(answers).map(([questionUid, answer]) => ({
            questionUid,
            answer,
          })),
        }),
      });

      const data = (await response.json()) as SubmitResponse | ErrorResponse;

      if (!response.ok) {
        // 409 (Conflict) for duplicate submission
        if (response.status === 409) {
          const errorData = data as ErrorResponse;
          toast({
            title: errorData.message || '既にこのアンケートには回答済みです。',
            status: 'warning',
            isClosable: true,
          });
          void router.push(`/gallery/poll/${String(pollUid)}/results`);
          return; // Stop execution here
        }
        // For other errors (like 403 Forbidden for deadline)
        const errorData = data as ErrorResponse;
        throw new Error(errorData.message || '回答の送信に失敗しました。');
      }

      toast({ title: '回答を送信しました！', status: 'success' });
      void router.push(`/gallery/poll/${String(pollUid)}/results`);
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: err.message,
          status: 'error',
          isClosable: true,
        });
      } else {
        toast({
          title: '予期せぬエラーが発生しました。',
          status: 'error',
          isClosable: true,
        });
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestion = (q: QuestionData) => {
    switch (q.type) {
      case 'single_choice':
        return (
          <RadioGroup
            onChange={(value) => handleAnswerChange(q.questionUid, value)}
            value={answers[q.questionUid] as string}
          >
            <Stack>
              {q.options?.map((opt) => (
                <Radio key={opt} value={opt}>
                  {opt}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      case 'multiple_choice':
        return (
          <CheckboxGroup
            onChange={(value) =>
              handleAnswerChange(q.questionUid, value as string[])
            }
            value={(answers[q.questionUid] as string[]) || []}
          >
            <Stack>
              {q.options?.map((opt) => (
                <Checkbox key={opt} value={opt}>
                  {opt}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        );
      case 'slider':
        return (
          <Slider
            min={q.min}
            max={q.max}
            onChange={(value) => handleAnswerChange(q.questionUid, value)}
            value={(answers[q.questionUid] as number) ?? q.min}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
            <Text textAlign="center" mt={10}>
              {String(answers[q.questionUid] ?? q.min)}
            </Text>
          </Slider>
        );
      case 'text':
        return (
          <Textarea
            onChange={(e) => handleAnswerChange(q.questionUid, e.target.value)}
            value={(answers[q.questionUid] as string) ?? ''}
            placeholder="回答を入力..."
          />
        );
      default:
        return null;
    }
  };

  if (error)
    return (
      <>
        <GalleryMeta
          title={`アンケート | Haruhate`}
          description="アンケートに答えましょう"
          ogUrl={`/gallery/poll/${poll?.pollUid || ''}`}
        />
        <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
        <SectionWrapper>
          <Alert status="error">
            <AlertIcon />
            アンケートの読み込みに失敗しました。
          </Alert>
        </SectionWrapper>
      </>
    );
  if (!poll || !isPageReady)
    return (
      <>
        <GalleryMeta
          title={`アンケート | Haruhate`}
          description={'アンケートに答えましょう'}
          ogUrl={`/gallery/poll`}
        />
        <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
        <LoadingSpinner />
      </>
    );
  return (
    <>
      <GalleryMeta
        title={`${poll.title} | Haruhate`}
        description={poll.description}
        ogUrl={`/gallery/poll/${poll.pollUid}`}
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />

      <SectionWrapper>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1">{poll.title}</Heading>
            {poll.description && <Text mt={2}>{poll.description}</Text>}
          </Box>

          <VStack spacing={6} align="stretch">
            {poll.questions.map((q) => (
              <FormControl
                key={q.questionUid}
                isRequired={q.isRequired}
                bg="white"
                borderRadius="md"
                border="0.5px solid"
                p={4}
              >
                <FormLabel>{q.text}</FormLabel>
                {renderQuestion(q)}
              </FormControl>
            ))}
          </VStack>

          <Button
            colorScheme="blue"
            onClick={() => void handleSubmit()}
            isLoading={isLoading}
            size="lg"
          >
            回答を送信する
          </Button>
          <Box pt={4}>
            <BackButton href="/gallery/poll">アンケート一覧に戻る</BackButton>
          </Box>
        </VStack>
      </SectionWrapper>
    </>
  );
};

export default PollPage;
