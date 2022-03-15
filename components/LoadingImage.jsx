import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

import Image from "next/image";

import { Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { IMAGE_ALT } from "@consts";

const defaultImg = {
    src: IMAGE_ALT,
    alt: 'No image',
    layout: 'fill',
    draggable: false
}

const Index = (props) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [localProps, setLocalProps] = useState(defaultImg);

    const { doneLoading, bgColor, blurDataURL, ...imgProps } = props;

    useEffect(() => {
        if (!_.isEqual(localProps, imgProps)) {
            setLocalProps(imgProps);
        }
    }, [imgProps, localProps]);

    // useEffect(() => {
    //     const run = async () => {
    //         console.log('run')
    //         const res = await encodeImageToBlurhash(defaultImg?.src);
    //         console.log(res);
    //     }
    //     run();
    // },[])

    return (
        <div style={{ position: "absolute", width: "100%", height: "100%" }}>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    opacity: loading ? (blurDataURL ? 1 : 0) : 1,
                    backgroundColor: bgColor || theme.palette.img_bg.main,
                }}
            >
                <Image
                    alt="Loading Image"
                    {...localProps}
                    onLoadingComplete={() => {
                        setLoading(false);
                        if (_.isFunction(doneLoading)) {
                            doneLoading();
                        }
                    }}
                />
            </div>
            {loading && !blurDataURL && (
                <Skeleton
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(to right, #64b5f6 0%, #ffd54f 100%)",
                    }}
                    variant="rectangular"
                    animation="wave"
                />
            )}
            {loading && !blurDataURL && (
                <div
                    style={{
                        position: "absolute",
                        width: 100,
                        height: 100,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Image
                            src="https://res.cloudinary.com/katyperrycbt/image/upload/v1645240546/Dual_Ball-1s-200px_tbjrjw.svg"
                            alt="Loading"
                            layout="fill"
                            objectFit="cover"
                            loading="eager"
                            draggable={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Index;
