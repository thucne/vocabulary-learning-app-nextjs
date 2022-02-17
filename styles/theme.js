import { Colors } from "@styles";

const MyTheme = (mode) => ({
  footer_title: {
    main: mode === "light" ? Colors.FOOTER_TITLE : Colors.WHITE,
  },
  footer_link: {
    main: mode === "light" ? Colors.FOOTER_LINK : Colors.WHITE,
  },
  black: {
    main: mode === "light" ? Colors.BLACK : Colors.WHITE,
  },
  white: {
    main: mode === "light" ? Colors.WHITE : Colors.BLACK,
  },
  mui_button: {
    main: mode === "light" ? Colors.MUI_BUTTON_LIGHT : Colors.GRAY_7,
  },
  mui_button_inner: {
    main: mode === "light" ? Colors.MUI_BUTTON_INNER : Colors.WHITE,
  },
  dashboard: {
    main: mode === "light" ? Colors.BG_MAIN : Colors.BG_MAIN_DARK,
    contrastText: "#fff",
  },
});

export default MyTheme;
