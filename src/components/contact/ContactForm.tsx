// src/components/contact/ContactForm.tsx
// お問い合わせフォーム本体
// React Hook Form + Zod でバリデーション、送信後はサンクスページへ遷移
import { Box, Button, Input, Select, Textarea, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import {
  CONTACT_CATEGORIES,
  ContactFormValues,
  contactSchema,
} from '@/lib/contact/validation';

import { ContactFormField } from './ContactFormField';

type ApiResponse = {
  success: boolean;
  message: string;
};

export const ContactForm: FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      category: 'お問い合わせ',
      content: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.success) {
        // サーバー側バリデーションエラー or サーバーエラー
        throw new Error(json.message || '送信に失敗しました。');
      }

      // 送信成功 → サンクスページへ遷移
      void router.push('/contact/thanks');
    } catch (error) {
      // ネットワークエラー等の予期しないエラー
      console.error('[ContactForm] 送信エラー:', error);
      alert(
        error instanceof Error
          ? error.message
          : '送信に失敗しました。しばらく時間をおいて再度お試しください。'
      );
    }
  };

  return (
    <Box
      as="form"
      onSubmit={(e: React.FormEvent) => void handleSubmit(onSubmit)(e)}
      w="100%"
    >
      <VStack spacing={6} align="stretch">
        <ContactFormField
          label="お名前(匿名可)"
          isRequired
          errorMessage={errors.name?.message}
        >
          <Input placeholder="山田 太郎" {...register('name')} />
        </ContactFormField>

        <ContactFormField
          label="メールアドレス(任意)"
          errorMessage={errors.email?.message}
        >
          <Input
            type="email"
            placeholder="example@email.com"
            {...register('email')}
          />
        </ContactFormField>

        <ContactFormField
          label="種別"
          isRequired
          errorMessage={errors.category?.message}
        >
          <Select {...register('category')}>
            {CONTACT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </ContactFormField>

        <ContactFormField
          label="内容"
          isRequired
          errorMessage={errors.content?.message}
        >
          <Textarea
            placeholder="お問い合わせ内容をご記入ください。（1000文字以内）"
            rows={6}
            {...register('content')}
          />
        </ContactFormField>

        <Button
          type="submit"
          colorScheme="pink"
          size="lg"
          isLoading={isSubmitting}
          loadingText="送信中..."
          w={{ base: '100%', md: 'auto' }}
          alignSelf="flex-end"
        >
          送信する
        </Button>
      </VStack>
    </Box>
  );
};
