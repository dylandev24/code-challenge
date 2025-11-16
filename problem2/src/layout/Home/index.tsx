import { VStack } from "@chakra-ui/react";
import Swap from "../../components/Swap";

export default function HomePage() {
  return (
    <VStack w={"full"} justifyContent={"center"}>
      <Swap />
    </VStack>
  );
}
