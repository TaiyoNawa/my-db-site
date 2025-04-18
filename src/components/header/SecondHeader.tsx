import { Box, BoxProps, Heading } from '@chakra-ui/react';
import { FC } from 'react';

import { HeaderWrapper } from './HeaderWrapper';
import { SECOND_HEADER_HEIGHT } from '../../assets/data/HeaderAssets';

type SecondHeaderProps = {
  isHeaderHidden: boolean;
  title: string;
} & BoxProps;

export const SecondHeader: FC<SecondHeaderProps> = ({
  isHeaderHidden,
  title,
}: SecondHeaderProps) => {
  return (
    <>
      {isHeaderHidden && <Box minH={SECOND_HEADER_HEIGHT} />}
      {/* Headerが隠れるとSecondHeaderがposition:relativeになるので、SecondeHeaderが消える。上はそれを補うためのBox */}
      <HeaderWrapper
        position={isHeaderHidden ? 'fixed' : 'relative'}
        top={isHeaderHidden ? '0' : 'auto'}
        minH={SECOND_HEADER_HEIGHT}
        background="white"
        boxShadow={isHeaderHidden ? 'sm' : 'none'}
        bgColor={
          isHeaderHidden ? 'rgba(255, 255, 255, 0.7)' : 'rgba(60, 60, 60, 1)'
        } //半透明
        backdropFilter="blur(10px)" //ぼかし効果
        display="flex"
        alignItems="center" //垂直方向に中央揃え
        zIndex={isHeaderHidden ? 1000 : 0} //素晴らしい！
        transition="all 0.1s "
      >
        <Heading
          as="h1"
          fontSize={{ base: '19px', md: '21px' }}
          textAlign="left"
          color={isHeaderHidden ? 'black' : 'white'}
        >
          {title}
        </Heading>
      </HeaderWrapper>
    </>
  );
};
