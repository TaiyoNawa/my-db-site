import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SampleText } from "../SampleComponent";
import React from "react";

// const testProps1 = {
//     summary:
//       '株式会社ＦＵＴＵＲＥＷＯＯＤＳは、情報技術の進化を活用しつつ、営業シーンにおける課題を解決し、営業の生産性向上と人の介在価値の明確化に貢献することを目指している、営業・マーケティング領域のDX支援ツールやデータ解析など',
//   };

describe("SampleComponentのテスト", () => {
  it("文字が表示される", () => {
    render(<SampleText />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
  it("文字が正しく表示される", () => {
    render(<SampleText />);
    expect(screen.getByRole("heading")).toHaveTextContent(
      "これはStorybookのサンプルです"
    );
  });
});
