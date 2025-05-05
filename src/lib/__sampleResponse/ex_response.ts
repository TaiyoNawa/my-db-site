import {
  QueryDatabaseResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const mockPageObjectResponse: PageObjectResponse[] = [
  {
    id: '2',
    object: 'page',
    created_time: '2025-04-12T08:00:00.000Z',
    last_edited_time: '2025-04-12T08:30:00.000Z',
    created_by: { id: 'user', object: 'user' },
    last_edited_by: { id: 'user', object: 'user' },
    archived: false,
    in_trash: false,
    parent: { type: 'database_id', database_id: 'dummy' },
    properties: {
      ID: {
        id: 'DDPg',
        type: 'unique_id',
        unique_id: { prefix: 'SRPOST', number: 4 },
      },
      カテゴリー: {
        id: 'FJ%3Bh',
        type: 'select',
        select: {
          id: '2c33138d-6b78-45bb-88fa-fcde96388813',
          name: 'レポート',
          color: 'green',
        },
      },
      SEO用説明文: {
        id: 'XXXX',
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: {
              content: '東京都のITサービス法人の最新売上高ランキングと分析',
              link: null,
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: '東京都のITサービス法人の最新売上高ランキングと分析',
            href: null,
          },
        ],
      },
      作成者: { id: 'XXXX', type: 'people', people: [] },
      推定読了時間: { id: 'XXXX', type: 'number', number: null },
      記事画像: { id: 'XXXX', type: 'files', files: [] },
      slug: {
        id: 'XXXXX',
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: { content: 'tokyo-it-service-top-100', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'tokyo-it-service-top-100',
            href: null,
          },
        ],
      },
      ステータス: {
        id: 'XXXXX',
        type: 'status',
        status: { id: 'XXXX', name: '下書き', color: 'gray' },
      },
      公開日: {
        id: 'XXXX',
        type: 'date',
        date: { start: '2025-01-01', end: null, time_zone: null },
      },
      タグ: {
        id: 'XXXX',
        type: 'multi_select',
        multi_select: [
          {
            id: 'e8f8a34b-1d9a-4c9f-bcaf-c9cca8664ea3',
            name: 'IT業界',
            color: 'green',
          },
          {
            id: 'f565fed9-73fc-44d7-890a-38ab7994f73b',
            name: 'ランキング',
            color: 'purple',
          },
        ],
      },
      タイトル: {
        id: 'title',
        type: 'title',
        title: [
          {
            type: 'text',
            text: { content: '東京都ITサービス業売上高トップ100', link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: '東京都ITサービス業売上高トップ100',
            href: null,
          },
        ],
      },
    },
    url: 'https://notion.so/page2',
    public_url: null,
    icon: null,
    cover: null,
  },
];

export const expectedGetReportItems: PageObjectResponse[] =
  mockPageObjectResponse;

export const expectedFetchPostsResponse: PageObjectResponse[] =
  mockPageObjectResponse;

export const expectedGetPostsResponse = [
  {
    page_id: '2',
    id: 'SRPOST-4',
    title: '東京都ITサービス業売上高トップ100',
    slug: 'tokyo-it-service-top-100',
    publish_date: '2025-01-01T00:00:00.000Z',
    updated_date: '2025-04-12T08:30:00.000Z',
    category: 'レポート',
    tags: ['IT業界', 'ランキング'],
    eyeCatch: null,
    seo_description: '東京都のITサービス法人の最新売上高ランキングと分析',
  },
];

export const mockQueryResponse: QueryDatabaseResponse = {
  object: 'list',
  results: mockPageObjectResponse,
  next_cursor: null,
  has_more: false,
  type: 'page_or_database',
  page_or_database: {},
};
