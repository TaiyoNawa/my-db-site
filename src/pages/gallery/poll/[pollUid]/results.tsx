'use client';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import useSWR from 'swr';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SectionWrapper } from '@/components/SectionWrapper';
import { BackButton } from '@/components/button/BackButton';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

// --- Types ---
interface QuestionInfo {
  questionUid: string;
  text: string;
  type: string;
  options?: string[];
}

interface ChoiceResult {
  [option: string]: number;
  submissionCount: number;
}

interface SliderResult {
  average: number;
  median: number;
  values: number[];
  submissionCount: number;
}

type TextResult = {
  texts: string[];
  submissionCount: number;
};

type QuestionResult = ChoiceResult | SliderResult | TextResult;

type ResultsData = {
  pollUid: string;
  title: string;
  description: string;
  questions: QuestionInfo[];
  results: {
    [questionUid: string]: QuestionResult;
  };
  totalSubmissions: number;
  deadline: string | null;
  hasVoted: boolean;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PollResultsPage = () => {
  const { isHeaderHidden } = useStickyHeader();

  const tickFormatter = (value: string) => {
    if (value.length > 10) {
      return `${value.substring(0, 10)}...`;
    }
    return value;
  };
  const router = useRouter();
  const { pollUid } = router.query;
  const [voterId, setVoterId] = useState<string | null>(null);

  useEffect(() => {
    setVoterId(Cookies.get('voterId') || null);
  }, []);

  const { data, error } = useSWR<ResultsData>(
    pollUid && typeof pollUid === 'string'
      ? `/api/poll/${pollUid}/results?voterId=${voterId || ''}`
      : null,
    fetcher
  );

  const renderResult = (q: QuestionInfo) => {
    const result = data?.results[q.questionUid];
    if (!result) return <Text>まだ回答がありません。</Text>;

    switch (q.type) {
      case 'single_choice':
      case 'multiple_choice': {
        const choiceResult = result as ChoiceResult;
        const chartData = Object.entries(choiceResult)
          .filter(([key]) => key !== 'submissionCount')
          .map(([name, value]) => ({ name, 票数: value }));

        return (
          <Box>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ left: -30, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-90}
                  textAnchor="end"
                  interval={0}
                  height={100}
                  dx={-5}
                  tickFormatter={tickFormatter}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="票数" fill="#3182ce" />
              </BarChart>
            </ResponsiveContainer>
            {q.type === 'single_choice' && (
              <Text mt={2} textAlign="right">
                単一選択式・回答者数: {choiceResult.submissionCount}人
              </Text>
            )}
            {q.type === 'multiple_choice' && (
              <Text mt={2} textAlign="right">
                複数選択式・回答者数: {choiceResult.submissionCount}人
              </Text>
            )}
          </Box>
        );
      }
      case 'slider': {
        const sliderResult = result as SliderResult;
        return (
          <Box>
            <StatGroup>
              <Stat>
                <StatLabel>平均値</StatLabel>
                <StatNumber>{sliderResult.average}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>中央値</StatLabel>
                <StatNumber>{sliderResult.median}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>回答者数</StatLabel>
                <StatNumber>{sliderResult.submissionCount}</StatNumber>
              </Stat>
            </StatGroup>
            <Accordion allowMultiple mt={4}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      すべての回答を表示
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {sliderResult.values.join(', ')}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        );
      }
      case 'text': {
        const textResult = result as TextResult;
        return (
          <Accordion allowMultiple>
            {textResult.texts.map((text, i) => (
              <AccordionItem key={i}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      回答 {i + 1}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>{text}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        );
      }
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
          ogUrl={`/gallery/poll/${pollUid?.toString() || ''}`}
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
  if (!data)
    return (
      <>
        <GalleryMeta
          title={`アンケート | Haruhate`}
          description="アンケートに答えましょう"
          ogUrl={'/gallery/poll'}
        />
        <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
        <LoadingSpinner />
      </>
    );

  // Handle cases where the poll does not exist or data is invalid
  if (!data.questions) {
    return (
      <>
        <GalleryMeta
          title={`アンケート | Haruhate`}
          description="アンケートに答えましょう"
          ogUrl={`/gallery/poll/${pollUid?.toString() || ''}`}
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
  }

  const StatusAlerts = () => {
    const isDeadlinePassed =
      data?.deadline && new Date() > new Date(data.deadline);

    return (
      <Box>
        {isDeadlinePassed && (
          <Alert status="warning" my={2}>
            <AlertIcon />
            このアンケートは締め切られています。
          </Alert>
        )}
        {data?.hasVoted && (
          <Alert status="info" my={2}>
            <AlertIcon />
            あなたはこのアンケートに回答済みです。
          </Alert>
        )}
      </Box>
    );
  };

  return (
    <>
      <GalleryMeta
        title={`${data.title} | Haruhate`}
        description={`アンケートの集計結果ページです。`}
        ogUrl={`/gallery/poll/${String(data.pollUid)}/results`}
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <VStack spacing={10} align="stretch">
          <StatusAlerts />
          <Box textAlign="center">
            <Heading as="h1">{data.title}</Heading>
            {data.description && (
              <Text mt={4} fontSize="md" color="gray.600" whiteSpace="pre-wrap">
                {data.description}
              </Text>
            )}
            <Text mt={2} fontSize="lg">
              総回答数: {data.totalSubmissions}件
            </Text>
          </Box>

          <VStack spacing={8} align="stretch">
            {data.questions.map((q) => (
              <Box
                key={q.questionUid}
                bg="white"
                p={4}
                borderRadius="md"
                border="0.5px solid"
              >
                <Heading as="h3" size="md" mb={4}>
                  {q.text}
                </Heading>
                {renderResult(q)}
              </Box>
            ))}
          </VStack>
          <Box pt={8}>
            <BackButton href="/gallery/poll">アンケート一覧に戻る</BackButton>
          </Box>
        </VStack>
      </SectionWrapper>
    </>
  );
};

export default PollResultsPage;
