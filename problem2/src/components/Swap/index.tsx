import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { LuArrowUpDown } from "react-icons/lu";
import { useSwap } from "../../hooks/useSwap";
import { useTokens } from "../../hooks/useTokens";
import type { Token } from "../../types";
import SuccessModal from "./SwapModal";
import TokenSelect from "./SwapSelectToken";
import SwapTokenInput from "./SwapTokenInput";

const MotionIconButton = motion(IconButton);

export default function SwapBox() {
  const { tokens, getBalance } = useTokens();
  const {
    fromToken,
    toToken,
    amount,
    expectedOut,
    setFromToken,
    setToToken,
    setAmount,
    switchTokens,
    canSwap,
    swap,
    loading,
    lastSwap,
    setLastSwap,
  } = useSwap(getBalance);

  const balance = fromToken ? getBalance(fromToken.currency) : 0;
  const [selecting, setSelecting] = useState<"from" | "to" | null>(null);

  const handleSelect = useCallback(
    (token: Token) => {
      if (selecting === "from" && token.currency === toToken?.currency) {
        switchTokens();
        setSelecting(null);
        return;
      }
      if (selecting === "to" && token.currency === fromToken?.currency) {
        switchTokens();
        setSelecting(null);
        return;
      }

      if (selecting === "from") setFromToken(token);
      else if (selecting === "to") setToToken(token);

      setSelecting(null);
    },
    [selecting, fromToken, toToken]
  );

  useEffect(() => {
    if (tokens.length > 1) {
      if (!fromToken) setFromToken(tokens[0]);
      if (!toToken) setToToken(tokens[1]);
    }
  }, [tokens]);

  return (
    <Box
      bg="#13141C"
      border="1px solid #20212A"
      w="420px"
      mx="auto"
      rounded="2xl"
      p={5}
      color="white"
      boxShadow="0px 0px 25px rgba(0,0,0,0.3)"
    >
      <VStack gap={5}>
        {/* —————————— FROM BOX —————————— */}
        <Box
          bg="#1B1C28"
          w="100%"
          p={4}
          rounded="xl"
          border="1px solid #2A2B38"
        >
          <Text color="gray.400" fontSize="sm" mb={2}>
            You pay
          </Text>

          <SwapTokenInput
            label=""
            token={fromToken}
            amount={amount}
            balance={balance}
            highlightError={Number(amount) > balance}
            onClickSelect={() => setSelecting("from")}
            onChangeAmount={(v) => setAmount(v)}
          />
        </Box>

        {/* SWITCH BUTTON */}
        <Flex justify="center" mt={-2} mb={-2}>
          <MotionIconButton
            aria-label="Switch"
            size="lg"
            rounded="full"
            bg="#3ED47A"
            color="black"
            border="4px solid #13141C"
            onClick={switchTokens}
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <Icon as={LuArrowUpDown} />
          </MotionIconButton>
        </Flex>

        {/* —————————— TO BOX —————————— */}
        <Box
          bg="#1B1C28"
          w="100%"
          p={4}
          rounded="xl"
          border="1px solid #2A2B38"
        >
          <Text color="gray.400" fontSize="sm" mb={2}>
            You receive
          </Text>

          <SwapTokenInput
            label=""
            token={toToken}
            amount={expectedOut ? expectedOut.toFixed(6) : "0.0"}
            readOnly
            onClickSelect={() => setSelecting("to")}
          />

          <Text mt={1} color="gray.500" fontSize="xs">
            Min. received: {expectedOut ? expectedOut.toFixed(6) : "0"}
          </Text>
        </Box>

        {/* RATE */}
        {fromToken && toToken && (
          <Text fontSize="xs" color="gray.500" mt={-2}>
            1 {fromToken.currency} ={" "}
            {(fromToken.price / toToken.price).toFixed(6)} {toToken.currency}
          </Text>
        )}

        {/* SWAP BUTTON */}
        <Button
          w="100%"
          py={6}
          rounded="xl"
          bg="#3ED47A"
          color="black"
          fontWeight="semibold"
          fontSize="lg"
          disabled={!canSwap || loading}
          onClick={swap}
          _hover={{ opacity: 0.9 }}
        >
          {loading ? "Swapping..." : "Confirm"}
        </Button>
      </VStack>

      {/* Token Select Modal */}
      {selecting && (
        <Box
          pos="fixed"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="blackAlpha.600"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={100}
          onClick={() => setSelecting(null)}
        >
          <Box
            bg="#1B1C28"
            p={4}
            w="400px"
            rounded="xl"
            border="1px solid #2A2B38"
            onClick={(e) => e.stopPropagation()}
          >
            <TokenSelect tokens={tokens} onSelect={handleSelect} />
          </Box>
        </Box>
      )}

      {lastSwap && (
        <SuccessModal data={lastSwap} onClose={() => setLastSwap(null)} />
      )}
    </Box>
  );
}
