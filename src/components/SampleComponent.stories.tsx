import { StoryFn } from "@storybook/react";
import React from "react";

import { SampleText } from "./SampleComponent";

const Default = {
  title: "components/SampleComponent",
  component: SampleText,
  args: {},
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        description: "これはサンプルのコンポーネントです。",
      },
    },
  },
};

export default Default;
export const Template: StoryFn<typeof SampleText> = () => <SampleText />;
