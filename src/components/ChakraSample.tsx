import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  Box,
  StackDivider,
  Text,
  Button,
} from "@chakra-ui/react";
import { FC } from "react";

export type CardWithDividerProps = {
  color?: string;
};
export type ButtonWithSizesProps = {
  onClick: () => void;
  color?: string;
};
export const CardWithDivider: FC<CardWithDividerProps> = ({ color }) => {
  return (
    <Card>
      <CardHeader textColor={color}>
        <Heading size="md">Client Report</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Summary
            </Heading>
            <Text pt="2" fontSize="sm">
              View a summary of all your clients over the last month.
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Overview
            </Heading>
            <Text pt="2" fontSize="sm">
              Check out the overview of your clients.
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Analysis
            </Heading>
            <Text pt="2" fontSize="sm">
              See a detailed analysis of all your business clients.
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export const ButtonWithSizes: FC<ButtonWithSizesProps> = ({
  onClick,
  color,
}) => {
  return (
    <Stack spacing={4} direction="row" align="center">
      <Button colorScheme="teal" size="xs" color={color} onClick={onClick}>
        Button
      </Button>
      <Button colorScheme="teal" size="sm" color={color} onClick={onClick}>
        Button
      </Button>
      <Button colorScheme="teal" size="md" color={color} onClick={onClick}>
        Button
      </Button>
      <Button colorScheme="teal" size="lg" color={color} onClick={onClick}>
        Button
      </Button>
    </Stack>
  );
};
