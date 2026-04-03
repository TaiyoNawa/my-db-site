// src/lib/contact/validation.ts
// お問い合わせフォームのZodバリデーションスキーマ
import { z } from 'zod';

export const CONTACT_CATEGORIES = [
  'お問い合わせ',
  '要望',
  '報告',
  'その他',
] as const;

export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export const contactSchema = z.object({
  // お名前：必須、1〜50文字
  name: z
    .string()
    .min(1, 'お名前を入力してください。')
    .max(50, 'お名前は50文字以内で入力してください。')
    .trim(),

  // メールアドレス：任意、入力した場合は正規のメール形式チェック
  email: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || val.trim() === '' || z.string().email().safeParse(val).success,
      { message: '正しいメールアドレス形式で入力してください。' }
    ),

  // 種別：必須、選択肢から選択
  category: z.enum(CONTACT_CATEGORIES, {
    message: '種別を選択してください。',
  }),

  // 内容：必須、1〜1000文字
  content: z
    .string()
    .min(1, 'お問い合わせ内容を入力してください。')
    .max(1000, 'お問い合わせ内容は1000文字以内で入力してください。')
    .trim(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
