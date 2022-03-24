export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";
export const UPDATE_USER = "UPDATE_USER";

export const SHOW_SNACKBAR = "SHOW_SNACKBAR";
export const HIDE_SNACKBAR = "HIDE_SNACKBAR";

export const SHOW_BACKDROP = "SHOW_BACKDROP";
export const HIDE_BACKDROP = "HIDE_BACKDROP";

export const SHOW_CONFIRM_DIALOG = "SHOW_CONFIRM_DIALOG";
export const HIDE_CONFIRM_DIALOG = "HIDE_CONFIRM_DIALOG";

export const SHOW_LINEAR = "SHOW_LINEAR";
export const HIDE_LINEAR = "HIDE_LINEAR";
export const SET_PERCENTAGE = "SET_PERCENTAGE";

export const SET_TAB_NAME = "SET_TAB_NAME";
export const RESET_TAB_NAME = "RESET_TAB_NAME";

export const SET_BG = "SET_BG";

// user data
export const SET_USER_DATA = "SET_USER_DATA";
export const CLEAR_USER_DATA = "CLEAR_USER_DATA";
export const UPDATE_USER_DATA = "UPDATE_USER_DATA";

export const IMAGE_ALT =
    "https://res.cloudinary.com/katyperrycbt/image/upload/v1646295258/3d-flame-side-view-of-camera-polaroid-shop_2_pf95qp.webp";
export const AVT_ALT = "https://res.cloudinary.com/katyperrycbt/image/upload/v1646312203/casual-life-3d-avatar-with-person-in-glasses-and-orange-shirt_1_lyykbz.webp";
export const NO_PHOTO = "https://res.cloudinary.com/katyperrycbt/image/upload/v1647163656/xcgdsqqcachgrqrkoycn.svg";
export const NO_PHOTO_SEO = "https://res.cloudinary.com/katyperrycbt/image/upload/v1647226081/dlhro6auss4rbo8eb9az.png";

export const AUDIO_ALT = "https://res.cloudinary.com/katyperrycbt/video/upload/v1646213479/1646213423733-voicemaker.in-speech_sjadtl.mp3";

export const VIP_TYPES = ["vocab", "idiom", "phrase"];
export const VOCAB_TYPES = ["noun", "verb", "adverb", "adjective", "other"];

export const NO_RECAPTCHA = "NO_RECAPTCHA";
export const DONE_RECAPTCHA = "DONE_RECAPTCHA";
export const RELOAD_RECAPTCHA = "RELOAD_RECAPTCHA";

export const UNSPLASH_LOGO_X = 'https://res.cloudinary.com/katyperrycbt/image/upload/v1647276336/q7wxkdaapg6rypdqrdlo.svg';
export const UNSPLASH_LOADING = 'https://res.cloudinary.com/katyperrycbt/image/upload/v1647408183/White_Clean_Now_Loading_Animation_Youtube_Video_pliqfe.gif';

export const LOADING_DUAL_BALLS = 'https://res.cloudinary.com/katyperrycbt/image/upload/v1647488137/Dual_Ball-1s-200px_2_uahymn.svg';

export const NO_AVT = () => {
    const someAvts = [
        'https://res.cloudinary.com/katyperrycbt/image/upload/v1647406463/avatar_4_hmioit.svg',
        'https://res.cloudinary.com/katyperrycbt/image/upload/v1647406464/avatar_3_f9ouoy.svg',
        'https://res.cloudinary.com/katyperrycbt/image/upload/v1647406464/avatar_1_cjw5h0.svg',
        'https://res.cloudinary.com/katyperrycbt/image/upload/v1647406464/avatar_2_hagun8.svg',
        'https://res.cloudinary.com/katyperrycbt/image/upload/v1647406464/avatar_5_rqfrv4.svg'
    ];

    return someAvts[Math.floor(Math.random() * someAvts.length)];
}

export const SET_THEME = "SET_THEME";

export const BLUR_SCREEN = "BLUR_SCREEN";
export const UNBLUR_SCREEN = "UNBLUR_SCREEN";

export const FORCE_RELOAD = "FORCE_RELOAD";
export const DONE_RELOAD = "DONE_RELOAD";