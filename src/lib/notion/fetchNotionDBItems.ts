// lib/notion/fetchNotionDBItems.ts
import {
  Client,
  isNotionClientError,
  ClientErrorCode,
  APIErrorCode,
  // LogLevel,
} from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
//参考：https://github.com/makenotion/notion-sdk-js

export type NotionDBItem = {
  page_id: string;
  title: string;
  status: string;
  category: string;
  description: string;
  url: string;
  thumbnail: string;
  ogDescription: string;
  ogImage: string;
  releaseDate: string;
};

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  // logLevel: LogLevel.DEBUG, //クライアントが応答本文をログに記録するようにしたい場合
});

export async function fetchNotionDBItems(
  pageSize?: number,
  startCursor?: string
) {
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      page_size: pageSize,
      start_cursor: startCursor,
      filter: {
        property: 'ステータス',
        status: {
          equals: '公開済み',
        },
      },
      sorts: [
        {
          property: '公開日',
          direction: 'ascending',
        },
      ],
    });
    const items: NotionDBItem[] = (res.results as PageObjectResponse[]).map(
      (item) => {
        const titleProp = item.properties['タイトル'];
        const statusProp = item.properties['ステータス'];
        const categoryProp = item.properties['カテゴリ'];
        const descriptionProp = item.properties['サマリ'];
        const urlProp = item.properties['URL名'];
        const thumbnailProp = item.properties['サムネイル画像'];
        const ogDescriptionProp = item.properties['og:description'];
        const ogImageProp = item.properties['og:image'];
        const releaseDateProp = item.properties['公開日'];

        const title =
          titleProp?.type === 'title' && titleProp.title.length > 0
            ? titleProp.title[0].plain_text
            : 'no title';
        const status =
          statusProp?.type === 'select' && statusProp.select
            ? statusProp.select?.name
            : 'no status';
        const category =
          categoryProp?.type === 'multi_select' && categoryProp.multi_select
            ? categoryProp.multi_select.map((c) => c.name).join(', ')
            : 'no category';
        const description =
          descriptionProp?.type === 'rich_text' &&
          descriptionProp.rich_text.length > 0
            ? descriptionProp.rich_text[0].plain_text
            : 'no description';
        const url =
          urlProp?.type === 'rich_text' && urlProp.rich_text.length > 0
            ? urlProp.rich_text[0].plain_text
            : '';

        const thumbnail =
          thumbnailProp?.type === 'files' && thumbnailProp.files.length > 0
            ? thumbnailProp.files[0]?.type === 'file'
              ? thumbnailProp.files[0].file.url
              : thumbnailProp.files[0]?.type === 'external'
                ? thumbnailProp.files[0].external.url
                : ''
            : '/alt/alt_image.png';
        const ogDescription =
          ogDescriptionProp?.type === 'rich_text' &&
          ogDescriptionProp.rich_text.length > 0
            ? ogDescriptionProp.rich_text[0].plain_text
            : 'Haruhate is a blog that provides information on the latest trends in the IT industry, including news, analysis, and insights on various topics.';
        const ogImage =
          ogImageProp?.type === 'files' && ogImageProp.files.length > 0
            ? ogImageProp.files[0]?.type === 'file'
              ? ogImageProp.files[0].file.url
              : '/favicon.ico' //ここはロゴ画像に変えて！！
            : '/favicon.ico'; //ここはロゴ画像に変えて！！
        const releaseDate =
          releaseDateProp?.type === 'date' && releaseDateProp.date
            ? releaseDateProp.date.start
            : '';

        return {
          page_id: item.id,
          title,
          status,
          category,
          description,
          url,
          thumbnail,
          ogDescription,
          ogImage,
          releaseDate,
        };
      }
    );
    return {
      results: items,
      next_cursor: res.next_cursor,
      has_more: res.has_more,
    };
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          console.error('Request timed out');
          break;
        case APIErrorCode.ObjectNotFound:
          console.error('Database not found');
          break;
        case APIErrorCode.Unauthorized:
          console.error('Unauthorized');
          break;
        // ...
        default:
          // you could even take advantage of exhaustiveness checking
          // assertNever(error.code);
          console.error('Unexpected error:', error.code);
      }
    }
  }
}
