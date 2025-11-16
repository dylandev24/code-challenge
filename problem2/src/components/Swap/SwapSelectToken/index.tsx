import { Box, Flex, Image, Input, Text } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import type { Token } from "../../../types";

export default function TokenSelect({
  tokens,
  onSelect,
}: {
  tokens: Token[];
  onSelect: (t: Token) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = useMemo(() => {
    if (!searchTerm) return tokens;

    return tokens.filter((t) =>
      t.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tokens, searchTerm]);

  return (
    <Box w={"full"}>
      <Input
        placeholder="Search token..."
        mb={3}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        color="white"
        borderColor="gray.600"
        _placeholder={{ color: "gray.400" }}
      />

      <Box maxH={"420px"} overflowY={"auto"}>
        {filteredTokens.map((t) => (
          <Flex
            key={t.currency}
            p={2}
            align="center"
            gap={4}
            cursor="pointer"
            _hover={{ bg: "#2A2B3C" }}
            borderRadius="md"
            onClick={() => onSelect(t)}
          >
            <Image src={t.logoURI} />
            <Text fontWeight="medium" color={"white"}>
              {t.currency}
            </Text>
          </Flex>
        ))}

        {filteredTokens.length === 0 && searchTerm && (
          <Text color="gray.400" p={2} textAlign="center">
            No results found for "{searchTerm}"
          </Text>
        )}
      </Box>
    </Box>
  );
}
