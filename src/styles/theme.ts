import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {},
  fonts: {
    heading:
      "'游ゴシック', YuGothic, 'ヒラギノ角ゴ Pro', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', sans-serif",
    body: "'游ゴシック', YuGothic, 'ヒラギノ角ゴ Pro', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', sans-serif;",
    mono: "'游ゴシック', YuGothic, 'ヒラギノ角ゴ Pro', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', sans-serif;",
  },
  colors: {
    // generate https://uicolors.app/create
    black: "#101010",
    primary: {
      "50": "#fff1f1",
      "100": "#ffdfdf",
      "200": "#ffc5c5",
      "300": "#ff9d9d",
      "400": "#ff6464",
      "500": "#ff3939", // main
      "600": "#ed1515",
      "700": "#c80d0d",
      "800": "#a50f0f",
      "900": "#881414",
      "950": "#4b0404",
    },
    secondary: {
      "50": "#b5ecff",
      "100": "#83e2ff",
      "200": "#48cfff",
      "300": "#1eb1ff",
      "400": "#0694ff",
      "500": "#0080ff", // main
      "600": "#0861c5",
      "700": "#0d549b",
      "800": "#0e335d",
    },
    tertiary: {
      "50": "#d8ffe3",
      "100": "#b4fec8",
      "200": "#7afb9e",
      "300": "#39ef6c",
      "400": "#0fd848",
      "500": "#06c63d", // main
      "600": "#088d2f",
      "700": "#0d6e2a",
      "800": "#0d5a25",
      "900": "#003311",
    },
  },
  zIndices: {
    docked: 100,
    dropdown: 200,
    sticky: 300,
    banner: 400,
    overlay: 500,
    modal: 600,
    popover: 700,
    skipLink: 800,
    toast: 900,
    tooltip: 1000,
  },
});
