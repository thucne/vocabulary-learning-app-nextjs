import { Colors } from "@styles";

const MyTheme = (mode) => ({
    footer_title: {
        main: mode === "light" ? Colors.FOOTER_TITLE : Colors.WHITE
    },
    footer_link: {
        main: mode === "light" ? Colors.FOOTER_LINK : Colors.WHITE
    },
    black: {
        main: mode === "light" ? Colors.BLACK : Colors.WHITE
    }
});


export default MyTheme;