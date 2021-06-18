import React from "react";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import MainRoutes from "./MainRoutes";
import theme from "./theme";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <div>
        <MainRoutes />
      </div>
    </ThemeProvider>
  );
};

export default App;
