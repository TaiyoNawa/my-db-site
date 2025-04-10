import { Box, Flex, BoxProps, Link } from "@chakra-ui/react";
import { FC } from "react";

import { COMPANY_URL, TERMS_OF_SERVICE_URL } from "@/assets/data";

// import { Copyright } from "./Copyright";
// import { BaseLink } from "../BaseLink";

type FooterProps = BoxProps;

export const Footer: FC<FooterProps> = ({ ...restProps }) => {
  return (
    <Box as="footer" py="8" bgColor="gray.800" w="full" px="4%" {...restProps}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "flex-start" }}
        align="center"
        gap={5}
        wrap="wrap"
      >
        <Link href={COMPANY_URL} mx={2} isExternal>
          運営会社
        </Link>
        <Link href={TERMS_OF_SERVICE_URL} isExternal mx={2}>
          利用規約
        </Link>
        {/* <Copyright
          ml={{ base: "none", md: "auto" }}
          my={{ base: 3, md: 0 }}
          color="gray.500"
        /> */}
      </Flex>
    </Box>
  );
};
