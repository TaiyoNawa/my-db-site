// src/lib/contact/email.ts
// お問い合わせ受信時の管理者へのメール通知（Nodemailer + Gmail SMTP）
import nodemailer from 'nodemailer';

import type { ContactFormValues } from './validation';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const ADMIN_EMAIL = process.env.CONTACT_ADMIN_EMAIL;

/**
 * 管理者へお問い合わせ通知メールを送信する
 * 環境変数が未設定の場合はスキップ（ローカル開発環境での動作を妨げない）
 */
export const sendContactNotificationEmail = async (
  payload: ContactFormValues
): Promise<void> => {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !ADMIN_EMAIL) {
    console.warn(
      '[contact/email] メール環境変数が未設定のためメール通知をスキップしました。'
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Haruhate" <${GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `【Haruhate】お問い合わせが届きました（${payload.category}）`,
    text: buildAdminText(payload),
    html: buildAdminHtml(payload),
  });
};

/** プレーンテキスト版 */
const buildAdminText = (payload: ContactFormValues): string => {
  const emailLine = payload.email?.trim()
    ? `メールアドレス: ${payload.email.trim()}`
    : 'メールアドレス: 未入力';

  return [
    'Haruhateにお問い合わせが届きました。',
    '',
    `お名前: ${payload.name}`,
    emailLine,
    `種別: ${payload.category}`,
    '',
    '【内容】',
    payload.content,
  ].join('\n');
};

/** HTML版 */
const buildAdminHtml = (payload: ContactFormValues): string => {
  const emailLine = payload.email?.trim()
    ? `<tr><th>メールアドレス</th><td>${payload.email.trim()}</td></tr>`
    : '<tr><th>メールアドレス</th><td>未入力</td></tr>';

  // XSS対策としてHTMLエスケープ
  const escape = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

  return `
    <h2>Haruhate にお問い合わせが届きました</h2>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
      <tr><th>お名前</th><td>${escape(payload.name)}</td></tr>
      ${emailLine}
      <tr><th>種別</th><td>${escape(payload.category)}</td></tr>
      <tr><th>内容</th><td>${escape(payload.content)}</td></tr>
    </table>
  `;
};
