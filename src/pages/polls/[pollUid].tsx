import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  Progress,
  Button,
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { LinkCopyButton } from '@/components/button/LinkCopyButton';

// Define types for poll data
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollData {
  pollUid: string;
  title: string;
  description?: string;
  options: PollOption[];
  deadline?: string | null;
  totalVotes: number;
  status: string; // e.g., '受付中', '終了'
}

// Define a fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    // error.info = await res.json(); // Uncomment if API returns error details in JSON
    error.message = `Error: ${res.status}`;
    throw error;
  }
  return res.json() as Promise<PollData>;
};

const PollDetailPage = () => {
  const router = useRouter();
  const { pollUid } = router.query;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voterId, setVoterId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Manage voter ID and check if already voted
  useEffect(() => {
    if (!pollUid || typeof pollUid !== 'string') return;

    // 1. Get or create voter ID
    let currentVoterId = Cookies.get('voterId');
    if (!currentVoterId) {
      currentVoterId = nanoid();
      Cookies.set('voterId', currentVoterId, { expires: 365 }); // Expires in 1 year
    }
    setVoterId(currentVoterId);

    // 2. Check if this poll has been voted on by this voter
    const votedPollsCookie = Cookies.get('votedPolls');
    if (votedPollsCookie) {
      try {
        const votedPolls = JSON.parse(votedPollsCookie) as string[];
        if (votedPolls.includes(pollUid)) {
          setHasVoted(true);
        }
      } catch (e) {
        console.error('Failed to parse votedPolls cookie:', e);
      }
    }
  }, [pollUid]);

  // Use SWR for data fetching
  const {
    data: pollData,
    error,
    isLoading,
    mutate, // mutate function to manually trigger revalidation
  } = useSWR<PollData, Error>( // Explicitly type the error as Error
    typeof pollUid === 'string' ? `/api/polls/${pollUid}` : null, // Fetch only if pollUid is a string
    fetcher,
    {
      refreshInterval: 5000, // Poll every 5 seconds for real-time updates
      revalidateOnFocus: true, // Revalidate when window gains focus
    }
  );

  // Handle voting
  const handleVote = async () => {
    if (
      !pollUid ||
      typeof pollUid !== 'string' ||
      !selectedOptionId ||
      !voterId ||
      isVoting ||
      hasVoted
    )
      return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/polls/${pollUid}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId: selectedOptionId, voterId }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      // After successful vote, trigger SWR revalidation
      await mutate();
      setHasVoted(true);

      // Mark this poll as voted in cookies
      const votedPollsCookie = Cookies.get('votedPolls');
      let votedPolls: string[] = [];
      if (votedPollsCookie) {
        try {
          votedPolls = JSON.parse(votedPollsCookie) as string[];
        } catch (e) {
          console.error('Failed to parse votedPolls cookie:', e);
        }
      }
      if (!votedPolls.includes(pollUid)) {
        votedPolls.push(pollUid);
        Cookies.set('votedPolls', JSON.stringify(votedPolls), {
          expires: 365,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '不明なエラーが発生しました。';
      console.error('Failed to submit vote:', errorMessage);
      alert(`投票に失敗しました: ${errorMessage}`);
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8} centerContent>
        <Spinner size="xl" />
        <Text mt={4}>読み込み中...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error">
          <AlertIcon />
          アンケートデータの取得に失敗しました: {error.message}
        </Alert>
      </Container>
    );
  }

  if (!pollData) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="info">
          <AlertIcon />
          アンケートが見つかりませんでした。
        </Alert>
      </Container>
    );
  }

  const isVotingOpen =
    pollData.status === '受付中' &&
    (!pollData.deadline || new Date(pollData.deadline) > new Date());

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        <Heading as="h1" size="xl">
          {pollData.title}
        </Heading>
        {pollData.description && <Text>{pollData.description}</Text>}
        {pollData.deadline && (
          <Text fontSize="sm" color="gray.500">
            締め切り: {new Date(pollData.deadline).toLocaleString()}
          </Text>
        )}
        {/* Voting Section */}
        {isVotingOpen && !hasVoted ? (
          <Box>
            <Heading as="h2" size="md" mb={4}>
              投票する
            </Heading>
            <RadioGroup
              onChange={setSelectedOptionId}
              value={selectedOptionId || ''}
            >
              <Stack direction="column" gap={3}>
                {pollData.options.map((option) => (
                  <Radio key={option.id} value={option.id}>
                    {option.text}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => {
                void handleVote();
              }}
              isLoading={isVoting}
              isDisabled={!selectedOptionId}
            >
              投票する
            </Button>
          </Box>
        ) : (
          <Text fontSize="lg" color="gray.600">
            {hasVoted ? '投票済みです。' : '投票期間は終了しました。'}
          </Text>
        )}
        {/* Results Section - Show only if voted or voting is closed */}
        {(hasVoted || !isVotingOpen) && (
          <Box>
            <Heading as="h2" size="md" mb={4}>
              投票結果
            </Heading>
            {pollData.totalVotes === 0 ? (
              <Text>まだ投票はありません。</Text>
            ) : (
              <VStack gap={4} align="stretch">
                {pollData.options.map((option) => {
                  const percentage =
                    pollData.totalVotes > 0
                      ? (option.votes / pollData.totalVotes) * 100
                      : 0;
                  return (
                    <Box key={option.id}>
                      <Text fontWeight="bold">{option.text}</Text>
                      <Progress
                        value={percentage}
                        size="lg"
                        colorScheme="teal"
                        hasStripe
                        isAnimated
                      />
                      <Text fontSize="sm" color="gray.600">
                        {option.votes} 票 ({percentage.toFixed(1)}%)
                      </Text>
                    </Box>
                  );
                })}
                <Text fontWeight="bold" mt={4}>
                  合計投票数: {pollData.totalVotes} 票
                </Text>
              </VStack>
            )}
          </Box>
        )}
        {/* Share URL Section */}
        {pollUid && (
          <Box mt={6}>
            <Heading as="h2" size="md" mb={2}>
              このアンケートを共有する
            </Heading>
            <LinkCopyButton
              href={
                typeof pollUid === 'string'
                  ? `${window.location.origin}/polls/${pollUid}`
                  : ''
              }
            />
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default PollDetailPage;
