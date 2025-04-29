// pages/api/AnimeSearch.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const ANILIST_API_URL = 'https://graphql.anilist.co';

type AnimeItem = {
  id: string;
  title: string;
  imageUrl?: string;
  seasonYear?: string;
  url?: string;
  studio?: string;
};

type Media_Anime = {
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
  seasonYear?: number;
  siteUrl?: string;
  studios?: {
    nodes?: {
      name?: string;
    }[];
  };
};

type AnimeSearchResponse = {
  data: {
    Page: {
      media: Media_Anime[];
    };
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnimeItem[] | { error: string }>
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
            type: ANIME,
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
            seasonYear
            siteUrl
            studios {
              nodes {
                name
              }
            }
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

    const json = (await response.json()) as AnimeSearchResponse;

    if (!json.data?.Page?.media) {
      res.status(500).json({ error: 'データ取得に失敗しました。' });
      return;
    }

    const results: AnimeItem[] = json.data.Page.media.map((anime) => ({
      id: anime.id.toString(),
      title:
        anime.title.native || anime.title.romaji || anime.title.english || '-',
      imageUrl: anime.coverImage?.large || anime.coverImage?.medium || '',
      seasonYear: anime.seasonYear?.toString() || '-',
      studio: anime.studios?.nodes?.[0]?.name || '-',
      url: anime.siteUrl || '',
    }));

    res.status(200).json(results);
  } catch (err) {
    console.error('APIエラー:', err);
    res.status(500).json({ error: '内部サーバーエラー' });
  }
}
