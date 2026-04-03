// src/components/contact/ContactFormField.tsx
// フォーム各フィールドの共通ラッパー（ラベル + エラーメッセージ）
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

type Props = {
  label: string;
  isRequired?: boolean;
  errorMessage?: string;
  children: ReactNode;
};

export const ContactFormField: FC<Props> = ({
  label,
  isRequired = false,
  errorMessage,
  children,
}) => {
  return (
    <FormControl isRequired={isRequired} isInvalid={!!errorMessage}>
      <FormLabel fontWeight="semibold">{label}</FormLabel>
      {children}
      {/* Zodのエラーメッセージを表示 */}
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};
