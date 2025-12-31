import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
    createTheme({
        palette: {
            mode,
            ...(mode === "light"
                ? {
                    primary: {
                        main: "#1E3A8A",
                    },
                    secondary: {
                        main: "#D4AF37",
                    },
                    background: {
                        default: "#F9FAFB",
                        paper: "#FFFFFF",
                    }
                }
                :
                {
                    background: {
                        default: "#0F172A",
                        paper: "#1E293B",
                    }
                }),
        },
        typography: {
            fontFamily: `'Inter', 'Helvetica', 'Arial', sans-serif`,
            button: {
                textTransform: "none",
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                    },
                },
            },
        },
    });
