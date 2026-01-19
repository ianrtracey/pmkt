import { Box, Text } from "ink";

export function StatusBar() {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
    >
      <Box gap={2}>
        <Text color="gray">[q] Quit</Text>
        <Text color="gray">[r] Refresh</Text>
        <Text color="gray">[?] Help</Text>
      </Box>
      <Box gap={2}>
        <Text color="green">Connected</Text>
        <Text color="gray">|</Text>
        <Text color="gray">Last updated: just now</Text>
      </Box>
    </Box>
  );
}
