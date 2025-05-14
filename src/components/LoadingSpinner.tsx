// src/components/LoadingSpinner.tsx
import { Box, BoxProps } from '@chakra-ui/react';
import { useMemo, FC } from 'react';
import {
  BarLoader,
  BeatLoader,
  BounceLoader,
  CircleLoader,
  ClipLoader,
  ClockLoader,
  DotLoader,
  FadeLoader,
  GridLoader,
  HashLoader,
  PacmanLoader,
  PuffLoader,
  PulseLoader,
  RingLoader,
  RiseLoader,
  RotateLoader,
  ScaleLoader,
  SyncLoader,
  ClimbingBoxLoader,
  MoonLoader,
  PropagateLoader,
  SquareLoader,
  SkewLoader,
} from 'react-spinners';

const spinnerConfigs = [
  //サイズ等は適宜調整する
  {
    Component: BarLoader,
    props: (size: number, color: string) => ({
      height: size / 4,
      width: size * 2,
      color,
    }),
  },
  {
    Component: BeatLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: BounceLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: CircleLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: ClipLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: ClockLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: DotLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: FadeLoader,
    props: (size: number, color: string) => ({
      height: size / 2,
      width: size,
      color,
    }),
  },
  {
    Component: GridLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: HashLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: PacmanLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: PuffLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: PulseLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: RingLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: RiseLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: RotateLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: ScaleLoader,
    props: (size: number, color: string) => ({
      height: size,
      width: size / 2,
      color,
    }),
  },
  {
    Component: SyncLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: ClimbingBoxLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: MoonLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: PropagateLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: SquareLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
  {
    Component: SkewLoader,
    props: (size: number, color: string) => ({ size, color }),
  },
];

type LoadingSpinnerProps = BoxProps & {
  spinnerColor?: string;
  size?: number; // 任意のサイズ
};

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  spinnerColor = '#60a5fa', // blue.400
  size = 40,
  ...props
}) => {
  const { Component: SpinnerComponent, props: getSpinnerProps } =
    useMemo(() => {
      const randomIndex = Math.floor(Math.random() * spinnerConfigs.length);
      return spinnerConfigs[randomIndex];
    }, []);

  const spinnerProps = getSpinnerProps(size, spinnerColor);

  return (
    <Box
      role="status"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      maxW="100%"
      overflow="hidden"
      {...props}
    >
      <SpinnerComponent {...spinnerProps} />
    </Box>
  );
};
