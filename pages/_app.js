import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@config/createEmotionCache";
import { createTheme } from "@mui/material/styles";

import myTheme from "@styles/theme";

import { store } from "@store";
import { Provider } from "react-redux";
import "@globalCSS";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export const ColorModeContext = React.createContext({
    toggleColorMode: () => { },
});

export default function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    const [mode, setMode] = React.useState("light");
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    React.useEffect(() => {
        setMode(localStorage.getItem("colorMode") || "light");
        setMounted(true);
    }, []);

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    localStorage?.setItem(
                        "colorMode",
                        prevMode === "light" ? "dark" : "light"
                    );
                    return prevMode === "light" ? "dark" : "light";
                });
            },
        }),
        []
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...myTheme(mode),
                },
            }),
        [mode]
    );

    return (
        <Provider store={store}>
            <CacheProvider value={emotionCache}>
                <Head>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                </Head>
                <div style={{ visibility: mounted ? "visible" : "hidden" }}>
                    <ThemeProvider theme={theme}>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline />
                        <ColorModeContext.Provider value={colorMode}>
                            <Component {...pageProps} />
                        </ColorModeContext.Provider>
                    </ThemeProvider>
                </div>
            </CacheProvider>
        </Provider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};
