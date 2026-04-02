'use client';
// pages/gallery/tool/poll/index.tsx
// /gallery/poll から /gallery/tool/poll に移動済み
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import useSWR from 'swr';

import { useStickyHeader } from '@/hooks/useStickyHeader';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SecondHeader } from '@/components/header/SecondHeader';
import { GalleryMeta } from '@/components/meta/GalleryMeta';

import { PollCard } from '@/features/gallery/poll/PollCard';

interface PollListItem {
  pollUid: string;
  title: string;
  description: string;
  status: string;
  deadline: string | null;
  questionCount: number;
  eyeCatchImage: string | null;
  totalVotes: number;
}
const GAP_SIZE = { base: '24px', md: '26px', lg: '36px' };

const fetcher = async (url: string): Promise<PollListItem[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch polls');
  }
  return res.json() as Promise<PollListItem[]>;
};

export default function PollsListPage() {
  const { isHeaderHidden } = useStickyHeader();
  const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'popular'

  const { data: polls, error } = useSWR<PollListItem[], Error>(
    `/api/poll?sortBy=${sortBy}`,
    fetcher
  );

  const isLoading = !polls && !error;

  return (
    <>
      <GalleryMeta
        title="アンケート一覧 | Haruhate"
        description="みんなが作成したアンケートを見てみよう"
        ogUrl="/gallery/tool/poll"
        category="アンケート"
      />
      <SecondHeader isHeaderHidden={isHeaderHidden} title="Gallery" />
      <SectionWrapper>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="lg" mb={4}>
              アンケート一覧
            </Heading>
            <Link
              href="/gallery/tool/poll/create"
              style={{ textDecoration: 'none' }}
            >
              <Button colorScheme="blue">新しいアンケートを作成</Button>
            </Link>
          </Box>

          <ButtonGroup>
            <Button
              colorScheme={sortBy === 'newest' ? 'green' : 'gray'}
              onClick={() => setSortBy('newest')}
            >
              新着順
            </Button>
            <Button
              colorScheme={sortBy === 'popular' ? 'green' : 'gray'}
              onClick={() => setSortBy('popular')}
            >
              人気順
            </Button>
          </ButtonGroup>

          {isLoading && <LoadingSpinner />}
          {error && <Text>アンケートの読み込みに失敗しました。</Text>}

          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing="36px"
            justifyItems="center"
            columnGap={GAP_SIZE}
            rowGap={GAP_SIZE}
            w="100%"
          >
            {polls?.map((poll) => {
              const isVotingOpen =
                poll.status !== '終了' &&
                (!poll.deadline || new Date(poll.deadline) > new Date());
              const eyeCatchImage = poll.eyeCatchImage
                ? `/pollImage/${poll.eyeCatchImage}`
                : '/alt/alt_image.png';

              return (
                <PollCard
                  key={poll.pollUid}
                  eyeCatch={eyeCatchImage}
                  title={poll.title}
                  description={poll.description}
                  url={`/gallery/tool/poll/${poll.pollUid}`}
                  numberOfQuestions={poll.questionCount}
                  isVotingOpen={isVotingOpen}
                  deadline={poll.deadline}
                  totalVotes={poll.totalVotes}
                  objectFit="contain"
                />
              );
            })}
          </SimpleGrid>
        </VStack>
      </SectionWrapper>
    </>
  );
}
