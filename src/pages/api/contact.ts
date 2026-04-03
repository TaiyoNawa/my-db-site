// src/pages/api/contact.ts
// お問い合わせフォームのAPIエンドポイント
// フロー: バリデーション → Notion保存 → SendGrid通知
import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';

import { sendContactNotificationEmail } from '@/lib/contact/email';
import { saveContactToNotion } from '@/lib/contact/notion';
import { contactSchema } from '@/lib/contact/validation';

type ApiResponse = {
  success: boolean;
  message: string;
  data?: { requestId: string };
  error?: string;
  details?: Record<string, string[] | undefined>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed', error: 'METHOD_NOT_ALLOWED' });
  }

  // サーバー側でも再バリデーション（フロントをバイパスされた場合の対策）
  let payload;
  try {
    payload = contactSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: '入力内容に誤りがあります。',
        error: 'VALIDATION_ERROR',
        details: error.flatten().fieldErrors,
      });
    }
    return res.status(400).json({ success: false, message: '不正なリクエストです。', error: 'BAD_REQUEST' });
  }

  // Notionへ保存
  let requestId: string;
  try {
    requestId = await saveContactToNotion(payload);
  } catch (error) {
    console.error('[api/contact] Notion保存エラー:', error);
    return res.status(500).json({
      success: false,
      message: '送信に失敗しました。しばらく時間をおいて再度お試しください。',
      error: 'NOTION_ERROR',
    });
  }

  // SendGridで管理者に通知（失敗してもユーザーにはエラーを返さない）
  try {
    await sendContactNotificationEmail(payload);
  } catch (error) {
    // メール通知失敗はログのみ。Notionには保存済みなので送信成功扱いにする
    console.error('[api/contact] メール通知エラー:', error);
  }

  return res.status(200).json({
    success: true,
    message: 'お問い合わせを受け付けました。',
    data: { requestId },
  });
}
