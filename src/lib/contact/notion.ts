// src/lib/contact/notion.ts
// お問い合わせデータをNotionデータベースに保存する
import { Client } from '@notionhq/client';

import type { ContactFormValues } from './validation';

// お問い合わせ専用のDBを使うため、専用の環境変数を参照する
const CONTACT_DATABASE_ID = process.env.NOTION_CONTACT_FORM_DATABASE_ID;

const notionClient = new Client({ auth: process.env.NOTION_TOKEN });

/** rich_textプロパティ用のヘルパー。空文字・undefinedは空配列を返す */
const toRichText = (value?: string) =>
  value && value.trim().length > 0 ? [{ text: { content: value.trim() } }] : [];

/**
 * お問い合わせ内容をNotionDBに保存する
 * @returns 作成されたNotionページのID
 */
export const saveContactToNotion = async (
  payload: ContactFormValues
): Promise<string> => {
  if (!CONTACT_DATABASE_ID) {
    throw new Error('NOTION_CONTACT_DATABASE_ID が設定されていません。');
  }

  const now = new Date().toISOString();

  const response = await notionClient.pages.create({
    parent: { database_id: CONTACT_DATABASE_ID },
    properties: {
      // Notionのタイトル列（必須）
      お名前: {
        title: toRichText(payload.name),
      },
      メールアドレス: {
        // 任意項目：未入力の場合はnullをセット
        email:
          payload.email && payload.email.trim().length > 0
            ? payload.email.trim()
            : null,
      },
      種別: {
        select: {
          name: payload.category,
        },
      },
      内容: {
        rich_text: toRichText(payload.content),
      },
      送信日時: {
        date: {
          start: now,
        },
      },
      ステータス: {
        // 新規送信時は「未着手」で固定
        status: {
          name: '未着手',
        },
      },
    },
  });

  return response.id;
};
