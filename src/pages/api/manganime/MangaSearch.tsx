import type { NextApiRequest, NextApiResponse } from 'next';

const ANILIST_API_URL = 'https://graphql.anilist.co';

type MangaItem = {
  id: string;
  title: string;
  imageUrl?: string;
  author?: string;
  releaseDate?: string;
  url?: string;
};

type Media_Manga = {
  id: number;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  coverImage?: {
    large?: string;
    medium?: string;
  };
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  staff?: {
    nodes?: {
      name?: {
        full?: string;
      };
    }[];
  };
  siteUrl?: string;
};

type MangaSearchResponse = {
  data: {
    Page: {
      media: Media_Manga[];
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MangaItem[] | { error: string }>
) {
  const keyword = req.query.keyword as string;
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 12;

  if (!keyword) {
    res.status(400).json({ error: 'キーワードが必要です。' });
    return;
  }

  const graphqlQuery = {
    query: `
      query ($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(
            search: $search,
            type: MANGA,
            isAdult: false,
            sort: [POPULARITY_DESC]
          ) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
            }
            startDate {
              year
              month
              day
            }
            staff {
              nodes {
                name {
                  full
                }
              }
            }
            siteUrl
          }
        }
      }
    `,
    variables: { search: keyword, page, perPage },
  };

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    const json = (await response.json()) as MangaSearchResponse;

    if (!json.data?.Page?.media) {
      res.status(500).json({ error: 'データ取得に失敗しました。' });
      return;
    }

    const results: MangaItem[] = json.data.Page.media.map((manga) => ({
      id: manga.id.toString(),
      title:
        manga.title.native || manga.title.romaji || manga.title.english || '-',
      imageUrl: manga.coverImage?.large || manga.coverImage?.medium || '',
      author: manga.staff?.nodes?.[0]?.name?.full || '-',
      releaseDate: manga.startDate?.year
        ? `${manga.startDate.year}-${manga.startDate.month ?? '01'}-${manga.startDate.day ?? '01'}`
        : '-',
      url: manga.siteUrl || '',
    }));

    res.status(200).json(results);
  } catch (err) {
    console.error('APIエラー:', err);
    res.status(500).json({ error: '内部サーバーエラー' });
  }
}
