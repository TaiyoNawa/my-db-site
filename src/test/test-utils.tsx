import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { ReactElement } from "react";

import { theme } from "@/styles/theme";

const customRender = (ui: ReactElement, options = {}) =>
  render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>, options);

export * from "@testing-library/react";
export { customRender as render };
