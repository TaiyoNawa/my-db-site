//lib/notion/fetchNotionPageContent.ts
import {
  Client,
  // LogLevel,
  isNotionClientError,
  ClientErrorCode,
  APIErrorCode,
} from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  // logLevel: LogLevel.DEBUG,
});

export async function fetchNotionPageContent(pageId: string): Promise<string> {
  try {
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const mdBlocks = await n2m.pageToMarkdown(pageId); //NotionのブロックをMarkdownブロックへ変換
    const markdownObject = n2m.toMarkdownString(mdBlocks); //Markdownブロックを文字列に変換
    // console.log('Markdown:', markdownObject);
    return markdownObject.parent; // MdStringObjectから文字列を取得して返す
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          console.error('🕒 リクエストがタイムアウトしました。');
          break;
        case APIErrorCode.ObjectNotFound:
          console.error(`❌ ページが見つかりません: ${pageId}`);
          break;
        case APIErrorCode.Unauthorized:
          console.error('🔐 認証に失敗しました。APIキーを確認してください。');
          break;
        default:
          console.error(`⚠️ 予期せぬエラー: ${error.code}`);
      }
    } else {
      console.error('⚠️ 不明なエラーが発生しました:', error);
    }
    return '記事の内容を取得できませんでした。';
  }
}
