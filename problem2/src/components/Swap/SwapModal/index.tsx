import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function SuccessModal({
  data,
  onClose,
}: {
  data: {
    from: string;
    to: string;
    amountIn: string;
    amountOut: number;
    toTokenURI: string;
    fromTokenURI: string;
  };
  onClose: () => void;
}) {
  return (
    <MotionBox
      pos="fixed"
      top="0"
      left="0"
      w="full"
      h="full"
      bg="blackAlpha.700"
      display="flex"
      justifyContent="center"
      alignItems="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      zIndex={2000}
    >
      <MotionBox
        bg="#232433"
        p={6}
        rounded="2xl"
        w="300px"
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">
          Swap Successful 🎉
        </Text>

        <Flex justify="center" mb={4}>
          <Image
            position={"absolute"}
            ml={8}
            src={data?.toTokenURI}
            alt="token"
            boxSize="48px"
            rounded="full"
          />
          <Image
            alt="token"
            src={data?.fromTokenURI}
            boxSize="48px"
            rounded="full"
            mr={8}
          />
        </Flex>

        <VStack align="start" gap={1} color="gray.300" fontSize="sm">
          <HStack>
            Amount:
            <HStack gap={1}>
              <Image
                src={data?.fromTokenURI}
                alt="token"
                boxSize="16px"
                rounded="full"
              />
              {data.amountIn}
            </HStack>
          </HStack>

          <HStack>
            Received:
            <HStack gap={1}>
              <Image
                src={data?.toTokenURI}
                alt="token"
                boxSize="16px"
                rounded="full"
              />
              {data.amountOut.toFixed(6)}
            </HStack>
          </HStack>
        </VStack>

        <Button mt={4} colorScheme="cyan" w="full" onClick={onClose}>
          Close
        </Button>
      </MotionBox>
    </MotionBox>
  );
}

export default SuccessModal;
