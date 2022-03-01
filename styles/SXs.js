export const MUI_NAV_ICON_BUTTON = {
    mr: 1,
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: (theme) => `1px solid ${theme.palette.mui_button.main}`,
    "& .MuiTouchRipple-root span": {
        borderRadius: "10px",
    },
    "&.MuiButton-root": {
        textTransform: "none !important",
    },
    "&.MuiLoadingButton-root": {
        textTransform: "none !important",
    },
};

export const MUI_NAV_BUTTON = {
    mr: 1,
    height: "40px",
    borderRadius: "10px",
    border: (theme) => `1px solid ${theme.palette.mui_button.main}`,
    "& .MuiTouchRipple-root span": {
        borderRadius: "10px",
    },
    "&:hover": {
        borderColor: (theme) => theme.palette.mui_button_inner.main,
    },
    "&.MuiButton-root": {
        textTransform: "none !important",
    },
    "&.MuiLoadingButton-root": {
        textTransform: "none !important",
    },
};

export const MUI_NAV_BUTTON_NO_MARGIN = {
    height: "40px",
    borderRadius: "10px",
    border: (theme) => `1px solid ${theme.palette.mui_button.main}`,
    "& .MuiTouchRipple-root span": {
        borderRadius: "10px",
    },
    "&:hover": {
        borderColor: (theme) => theme.palette.mui_button_inner.main,
    },
    "&.MuiButton-root": {
        textTransform: "none !important",
    },
    "&.MuiLoadingButton-root": {
        textTransform: "none !important",
    },
};

export const COMMON_BUTTON_STYLES = {
    "&.MuiButton-root": {
        textTransform: "none !important",
    },
};

export const LOADING_BUTTON_STYLES = {
    "&.MuiLoadingButton-root": {
        textTransform: "none !important",
    },
};

export const TOGGLE_BUTTON_STYLES = {
    "&.MuiToggleButton-root": {
        textTransform: "none !important",
    },
};

export const AUTO_FILLED_TEXT_COLOR = {
    background: `linear-gradient(to top right, #9b314d 0%, #ffd54f 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent !important",
};
