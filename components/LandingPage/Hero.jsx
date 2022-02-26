import React, {
    useState,
    useEffect,
    useRef,
    useLayoutEffect,
    useCallback,
} from "react";

import Image from "next/image";
import Link from "next/link";

import { Grid, Typography, Link as MuiLink, Container } from "@mui/material";

import { Colors, Fonts } from "@styles";
import { getSizeImage } from "@utils";

const images = [
    "https://res.cloudinary.com/katyperrycbt/image/upload/v1645008265/White_Blue_Modern_Minimalist_Manufacture_Production_Dashboard_Website_Desktop_Prototype_2_u9bt9p.png",
];

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useWindowSize(elRef) {
    const [sizes, setSizes] = useState([0, 0]);

    useIsomorphicLayoutEffect(() => {
        function updateSize() {
            setSizes([elRef.current.clientWidth, elRef.current.clientHeight]);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window && window.removeEventListener("resize", updateSize);
    }, [elRef]);

    return sizes;
}

const Hero = () => {
    const [sizes, setSizes] = useState([]);
    const myRef = useRef(null);
    const myRef2 = useRef(null);

    const heroSizes = useWindowSize(myRef);
    const imageGridSizes = useWindowSize(myRef2);

    useEffect(() => {
        const loop = setInterval(() => {
            if (
                sizes.filter((item) => item.width && item.height).length !==
                images.length
            ) {
                images.forEach((image) => {
                    getSizeImage(image, (data) => {
                        setSizes((prev) => [...prev, data]);
                    });
                });
            } else {
                clearInterval(loop);
            }
        }, 500);
        return () => clearInterval(loop);
    }, [sizes]);

    return (
        <Container maxWidth={false} disableGutters sx={{ pb: 3, mt: [5, 7, 0] }}>
            <Grid container alignItems="center">
                <Grid
                    ref={myRef}
                    item
                    xs={12}
                    md={7}
                    lg={6}
                    pl={[3, 8, 15, 21]}
                    pr={[3, 5, 8]}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: Fonts.FW_500,
                            fontSize: "clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)",
                        }}
                    >
                        The{" "}
                        <Typography
                            variant="h2"
                            component="span"
                            color="primary"
                            sx={{
                                fontWeight: Fonts.FW_500,
                                fontSize: "clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)",
                            }}
                        >
                            word learning tool
                        </Typography>{" "}
                        you always wanted.
                    </Typography>
                    <Typography
                        variant="body1"
                        component="p"
                        sx={{ mt: 2 }}
                        color="text.disabled"
                    >
                        VIP provides a simple way to learn words such as{" "}
                        <b style={{ color: Colors.LOGO_YELLOW }}>vocabulary</b>,{" "}
                        <b style={{ color: Colors.LOGO_BLUE }}>idioms</b> and{" "}
                        <b style={{ color: Colors.LOGO_RED }}>phrases</b>. It is easy to use
                        and has a simple interface.
                    </Typography>
                </Grid>
                <Grid
                    ref={myRef2}
                    item
                    xs={12}
                    md={5}
                    lg={6}
                    display={["none", "none", "flex"]}
                    sx={{
                        position: "relative",
                        height: Math.round(heroSizes[1] * 2),
                        boxShadow: (theme) => theme.shadows[4],
                        borderBottomLeftRadius: (theme) => theme.spacing(2),
                        overflow: "hidden",
                    }}
                >
                    {images?.[0] &&
                        imageGridSizes?.[0] > 0 &&
                        sizes?.[0]?.width > 0 &&
                        sizes?.[0]?.height > 0 && (
                            <div
                                style={{
                                    width: Math.round(imageGridSizes?.[0] * 1.5),
                                    height: Math.round(heroSizes[1] * 2),
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <Image
                                    src={images[0]}
                                    alt="VIP"
                                    layout="fill"
                                    objectFit="cover"
                                    priority={true}
                                    draggable={false}
                                />
                            </div>
                        )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Hero;
