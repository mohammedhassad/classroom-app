import Navbar from "@/components/Navbar";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import ScreensRoot from "@/screens/Root";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />

      <Box as="main" mt={14} mb={5}>
        <ScreensRoot />
      </Box>
    </ThemeProvider>
  );
}

export default App;
