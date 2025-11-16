import { VStack } from "@chakra-ui/react";
import HomePage from "./layout/Home";

function App() {
  return (
    <VStack
      minH="100vh"
      justifyContent="center"
      w="full"
      background={"linear-gradient(to right, #e8cbc0, #636fa4)"}
    >
      <HomePage />
    </VStack>
  );
}

export default App;
