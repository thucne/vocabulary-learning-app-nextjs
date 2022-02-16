import { Colors } from "@styles";

const MyTheme = (mode) => ({
    footer_title: {
        main: mode === "light" ? Colors.FOOTER_TITLE : Colors.WHITE
    }
});


export default MyTheme;