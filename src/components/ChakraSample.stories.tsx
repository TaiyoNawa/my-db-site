import { action } from "@storybook/addon-actions";
import { StoryFn } from "@storybook/react";
import React from "react";

import { ButtonWithSizes } from "./ChakraSample";
import { CardWithDivider } from "./ChakraSample";

//全体のdefault値の設定
const Default = {
  title: "components/ChakraSample", //storybookのタイトル
  //component: 'CardWithDivider',//使用するコンポーネント（なくても可）
  args: {
    //Propsに代入する値
    color: "yellow",
    onClick: action("button-click"),
  },
  tags: ["autodocs"], // 自動ドキュメント生成の設定
  parameters: {
    docs: {
      description: {
        component: "chakra-uiのサンプルコンポーネントです。", //ドキュメントのコメント
      },
    },
  },
};

export default Default; //Storybookで表示させるにはdefault exportが必要

//Card Divider
export const CardDivider: StoryFn<typeof CardWithDivider> = (args) => (
  <CardWithDivider {...args} />
);
//Button Sizes
export const ButtonSizes: StoryFn<typeof ButtonWithSizes> = (args) => (
  <ButtonWithSizes {...args} />
);
