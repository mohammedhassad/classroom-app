import { createTheme } from "@mui/material";

const theme = createTheme({
  // typography: {
  //   useNextVariants: true,
  // },
  palette: {
    primary: {
      light: "#8e8e8e",
      main: "#616161",
      dark: "#373737",
      contrastText: "#fffde7",
    },
    secondary: {
      light: "#ffad42",
      main: "#f57c00",
      dark: "#bb4d00",
      contrastText: "#fffde7",
    },
    openTitle: "#455a64",
    protectedTitle: "#f57c00",
    type: "light",
  },
  elevation: {
    1: "0px 0px 0px 1px rgb(140 140 140/.2)",
  },
});

export default theme;
