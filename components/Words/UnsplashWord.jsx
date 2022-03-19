import React, { useEffect, useState } from 'react';

import {
    Paper, Typography, Grid, IconButton,
    Tooltip, Avatar, CircularProgress, Link as MuiLink,
    Icon
} from '@mui/material';

import LoadingImage from '@components/LoadingImage';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';

import { UNSPLASH_LOGO_X, UNSPLASH_LOADING, NO_AVT } from '@consts';
import { encodeImageToBlurhash, toDataURL, deepExtractObjectStrapi } from '@utils';
import { Colors, Props, Fonts } from '@styles';
import words from "@components/Words/words";
import { API } from '@config';

import _ from 'lodash';
import Image from 'next/image';

const RANDOM_PHOTO = (word) => `https://source.unsplash.com/random?${word}`;
const NEW_RANDOM = (word) => `https://unsplash.com/napi/search?query=${word}&per_page=20&xp=`;
const UPDATE_UNSPLASH = (word) => `${API}/api/unsplashes/update-keyword/${word}`;
const GET_LOCAL_UNSPLASH = (word) => `${API}/api/unsplashes?word=${word}`;


const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

const UnsplashWord = ({ width, unsplashVip }) => {

    const [img, setImg] = useState(unsplashVip?.photo?.results?.[0]);
    const [word, setWord] = useState(unsplashVip?.word);
    const [hoverImg, setHoverImg] = useState(false);
    const [hoverA, setHoverA] = useState(false);
    const [hoverB, setHoverB] = useState(false);

    const [loading, setLoading] = useState(false);

    const blurDataURL = img?.blur_hash;
    const src = img?.urls?.regular;
    const author = img?.user?.name;
    const authorUrl = img?.user?.links?.html;
    const authorImg = img?.user?.profile_image?.small || NO_AVT();
    const imgAlt = img?.alt_description || word;
    const downloadUrl = img?.links?.download ? `${img?.links?.download}&force=true` : '';
    const seeOnUnsplash = img?.id ? `https://unsplash.com/photos/${img?.id}` : '';

    const run = async () => {
        setLoading(true);

        let randomWord = getRandomWord();

        setWord(randomWord);

        setImg({
            urls: { regular: UNSPLASH_LOADING },
            blur_hash: 'L69tP;?b004n_3xuV@Rj00IU~q?b'
        })

        // const url = await toDataURL(RANDOM_PHOTO(randomWord));
        // const blurData = await encodeImageToBlurhash(url);

        const localRes = await fetch(GET_LOCAL_UNSPLASH(randomWord));
        const localData = await localRes.json().catch(() => ({}));

        const handledData = deepExtractObjectStrapi(localData)?.[0];

        if (!_.isEmpty(handledData)) {
            // random
            const url = handledData.urls[Math.floor(Math.random() * handledData.urls.length)];

            setImg({
                urls: { regular: url },
            });
        } else {

            const res = await fetch(RANDOM_PHOTO(randomWord));

            // get unsplash id from url
            const url = res.url;

            setImg({
                urls: { regular: url },
            })

            // save to cms
            await fetch(UPDATE_UNSPLASH(randomWord), {
                method: 'PUT',
                body: JSON.stringify({ url }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        }

        setLoading(false);
    }

    const imgClass = hoverA || hoverB || hoverImg ? 'unsplashHover' : '';
    const buttonClass = hoverA || hoverB || hoverImg ? 'unsplashButtonHover' : '';
    const isHover = hoverImg || hoverA || hoverB;

    const hoverAll = () => {
        setHoverA(true);
        setHoverB(true);
        setHoverImg(true);
    }

    const resetHoverAll = () => {
        setHoverImg(false);
        setHoverA(false);
        setHoverB(false);
    }

    const handleRefresh = async () => {
        resetHoverAll();
        await run();
    }

    return (
        <Paper sx={{
            width: width,
            height: width,
            maxWidth: 300,
            maxHeight: 300,
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative'
        }}
            onMouseLeave={resetHoverAll}
        >
            <label title="Refresh">
                <IconButton
                    onClick={handleRefresh}
                    sx={{
                        color: !isHover ? Colors.BLUE_PUBLIC_WORDS : Colors.WHITE,
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        zIndex: 101,
                    }}
                    size="small"
                    disabled={loading || !_.isEmpty(authorUrl)}
                    onMouseEnter={hoverAll}
                    onMouseLeave={resetHoverAll}
                >
                    {
                        loading
                            ? <CircularProgress size="18px" sx={{ color: 'inherit' }} />
                            : <RefreshRoundedIcon sx={{ fontSize: 'inherit' }} />
                    }
                </IconButton>
            </label>
            <Grid container {...Props.GCRCC}>
                <Grid item xs={12} {...Props.GICCC} sx={{
                    height: width / 2,
                    width: width,
                    maxHeight: 150,
                    backgroundColor: Colors.WOAD_YELLOW,
                    position: 'relative',
                }}
                    onMouseEnter={() => setHoverImg(true)}
                    onMouseLeave={() => setHoverImg(false)}
                >
                    <div style={{
                        height: width / 2,
                        width: width,
                        maxHeight: 150,
                        display: isHover ? 'block' : 'none',
                        opacity: '0.5',
                        backgroundColor: Colors.BLACK,
                        zIndex: 100
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width,
                        maxWidth: 300,
                        height: width / 2,
                        maxHeight: 150,
                    }}
                        className={imgClass}
                    >
                        <div style={{
                            position: 'relative', width: '100%', height: '100%',
                        }}
                        >
                            {src && <LoadingImage
                                src={src}
                                alt={imgAlt}
                                layout="fill"
                                placeholder="blue"
                                blurDataURL={blurDataURL}
                                objectFit="cover"
                                quality={100}
                                draggable={false}
                            />}
                        </div>
                    </div>
                    <div style={{
                        position: 'absolute', zIndex: 101,
                        bottom: '0.5rem', left: '0.5rem', maxWidth: '80%',
                        display: isHover ? 'block' : 'none'
                    }}
                        onMouseEnter={hoverAll}
                        onMouseLeave={() => setHoverA(false)}
                    >
                        {
                            authorUrl && <MuiLink
                                href={authorUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                underline='none'
                            >
                                <Grid container {...Props.GCRCC}>
                                    <Avatar
                                        src={authorImg}
                                        alt={author}
                                        sx={{
                                            cursor: 'pointer',
                                            boxShadow: theme => theme.shadows[3],
                                            width: 30,
                                            height: 30,
                                            mr: 1
                                        }}
                                    />
                                    {/* author name */}
                                    <Typography sx={{ color: Colors.WHITE, fontSize: Fonts.FS_15 }} className="overflowTypography">
                                        {author}
                                    </Typography>
                                </Grid>
                            </MuiLink>
                        }
                    </div>
                    <div style={{
                        position: 'absolute', zIndex: 101, bottom: '0.5rem', right: '0.5rem',
                        display: isHover ? 'block' : 'none',
                    }}
                        onMouseEnter={hoverAll}
                        onMouseLeave={() => setHoverB(false)}
                        className={buttonClass}
                    >
                        <Grid container {...Props.GCCCC}>
                            {/* see on unsplash */}
                            {
                                seeOnUnsplash && <label title="See on Unsplash">
                                    <IconButton
                                        href={seeOnUnsplash}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            backgroundColor: Colors.WHITE,
                                            fontSize: Fonts.FS_15,
                                            borderRadius: '4px',
                                            "& .MuiTouchRipple-root span": {
                                                borderRadius: "4px",
                                            },
                                            ":hover": {
                                                backgroundColor: Colors.WHITE,
                                                borderRadius: '4px'
                                            },
                                            mb: 1
                                        }}
                                    >
                                        <Icon sx={{ fontSize: 'inherit' }}>
                                            <Image
                                                src="https://res.cloudinary.com/katyperrycbt/image/upload/v1647416461/Unsplash_Symbol_sgqeja.svg"
                                                alt="See on Unsplash"
                                                width={30}
                                                height={30}
                                                quality={100}
                                            />
                                        </Icon>
                                    </IconButton>
                                </label>
                            }
                            {/* download button */}
                            {
                                downloadUrl && <label title="Download">
                                    <IconButton
                                        onClick={() => {
                                            window?.open(downloadUrl);
                                        }}
                                        sx={{
                                            backgroundColor: Colors.WHITE,
                                            fontSize: Fonts.FS_15,
                                            borderRadius: '4px',
                                            "& .MuiTouchRipple-root span": {
                                                borderRadius: "4px",
                                            },
                                            ":hover": {
                                                backgroundColor: Colors.WHITE,
                                                borderRadius: '4px'
                                            },
                                        }}
                                    >
                                        <ArrowDownwardIcon sx={{ fontSize: 'inherit' }} />
                                    </IconButton>
                                </label>
                            }
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={12} {...Props.GICCC}
                    sx={{
                        height: width / 2, maxHeight: 150,
                        px: 2, py: 1,
                        position: 'relative'
                    }}
                    className="overflowTypography"
                >

                    <Typography variant="h4" sx={{
                        color: Colors.BLUE_PUBLIC_WORDS,
                        mt: 1,
                        zIndex: 1000,
                    }} className="overflowTypography">
                        {word?.toLowerCase()}
                    </Typography>

                    <Grid container {...Props.GCRCC}>
                        <Typography sx={{
                            color: (theme) => theme.palette.mainPublicWord.main,
                            fontSize: Fonts.FS_14,
                            mr: 1
                        }} align="center">
                            Powered by
                        </Typography>
                        <MuiLink href="https://unsplash.com">
                            <div style={{
                                position: "relative",
                                width: 80,
                                height: 40,
                                cursor: 'pointer',
                            }}
                            >
                                <LoadingImage
                                    src={UNSPLASH_LOGO_X}
                                    alt="Unsplash"
                                    layout="fill"
                                    objectFit="contain"
                                    bgColor="transparent"
                                    draggable={false}
                                    blurDataURL="LIE{hEaK16M{.TRjNHkB_NWAM{ae"
                                />
                            </div>
                        </MuiLink>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default UnsplashWord;