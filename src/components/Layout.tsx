import { Box } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  return <Box>{children}</Box>;
};
