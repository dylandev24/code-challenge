import {
  Box,
  Flex,
  Image,
  Input,
  Text,
  VStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Token } from "../../../types";

interface Props {
  label: string;
  token: Token | any;
  amount?: string;
  readOnly?: boolean;
  balance?: number;
  highlightError?: boolean;
  onClickSelect: () => void;
  onChangeAmount?: (v: string) => void;
}

export default function SwapTokenInput({
  label,
  token,
  amount,
  readOnly = false,
  balance,
  highlightError,
  onClickSelect,
  onChangeAmount,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <VStack alignItems="start" w="full" gap={1.5}>
      <Text fontSize="sm" color="gray.400">
        {label}
      </Text>

      <Box
        w="100%"
        bg="#2A2B3C"
        borderWidth="1px"
        borderColor={isFocused ? "gray.400" : "gray.700"}
        transition="0.2s"
        p={3}
        rounded="xl"
      >
        <Flex align="center" justify="space-between" gap={3}>
          {/* TOKEN SELECT BUTTON */}
          <Button
            bg="transparent"
            _hover={{ bg: "whiteAlpha.200" }}
            px={3}
            h="40px"
            minW="130px"
            rounded="lg"
            display="flex"
            alignItems="center"
            gap={2}
            onClick={onClickSelect}
          >
            {token ? (
              <Image
                src={token.logoURI}
                alt={token.currency}
                boxSize="28px"
                rounded="full"
              />
            ) : (
              <Box boxSize="28px" rounded="full" bg="gray.600" opacity={0.5} />
            )}

            <Text fontWeight="bold" color={"white"} fontSize="md">
              {token ? token.currency : "Select Token"}
            </Text>

            <Icon
              as={ChevronDown}
              boxSize={4}
              color={"white"}
              ml="auto"
              opacity={0.8}
            />
          </Button>

          {/* INPUT */}
          <Input
            value={amount ?? ""}
            placeholder="0.0"
            readOnly={readOnly}
            onChange={(e) => {
              let v = e.target.value;

              if (!/^[0-9]*\.?[0-9]*$/.test(v)) return;
              if (v.startsWith("-")) return;

              onChangeAmount?.(v);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            textAlign="right"
            fontSize="xl"
            flex="1"
            ml={2}
            border="none"
            bg="transparent"
            color="white"
            minW="0"
            overflow="hidden"
            textOverflow="ellipsis"
            _focus={{
              outline: "none",
              boxShadow: "none",
              border: "none",
            }}
          />
        </Flex>
      </Box>

      {/* BALANCE */}
      {typeof balance === "number" && token && (
        <Text
          fontSize="xs"
          alignSelf="flex-end"
          color={highlightError ? "red.300" : "gray.500"}
        >
          Balance: {balance}
        </Text>
      )}
    </VStack>
  );
}
