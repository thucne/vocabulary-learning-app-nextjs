import React, { useEffect, useState } from 'react';

import { Paper, Typography, Grid, IconButton, Tooltip, Avatar, CircularProgress } from '@mui/material';
import { Colors, Props, Fonts } from '@styles';
import _ from 'lodash';
import { UNSPLASH } from '@config';
import LoadingImage from '@components/LoadingImage';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { UNSPLASH_LOGO_X } from '@consts';
import words from "@components/Words/words";

import Link from 'next/link';

import { encodeImageToBlurhash, toDataURL } from '@utils';

const RANDOM_QUERY = (word) => `https://api.unsplash.com/search/photos?query=${word}&per_page=1`;
const RANDOM_PHOTO = (word) => `https://source.unsplash.com/random?${word}`;

const UnsplashWord = ({ width, unsplashVip }) => {
    console.log(unsplashVip);

    const [img, setImg] = useState(unsplashVip?.photo?.results?.[0]);
    const [word, setWord] = useState(unsplashVip?.word);

    const [loading, setLoading] = useState(false);

    const blurDataURL = img?.blur_hash;
    const src = img?.urls?.regular;
    const author = img?.user?.name;
    const authorUrl = img?.user?.links?.html;
    const authorImg = img?.user?.profile_image?.small;
    const imgAlt = img?.alt_description || word;
    const downloadUrl = img?.links?.download;

    const run = async () => {
        setLoading(true);
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setWord(randomWord);
        const res = await fetch(RANDOM_QUERY(randomWord), {
            headers: {
                Authorization: `Client-ID ${UNSPLASH}`
            }
        });
        const data = await res.json().catch(err => console.log(err));

        if (_.isEmpty(data?.photo?.results)) {

            const url = await toDataURL(RANDOM_PHOTO(randomWord));
            const blurData = await encodeImageToBlurhash(url);

            setImg({
                urls: { regular: url },
                blur_hash: blurData,
            })
        } else {
            setImg(data?.photo?.results?.[0]);
        }

        setLoading(false);
    }

    const handleRefresh = async () => {
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
            position: 'relative',
        }}>
            <Tooltip title="Refresh">
                <IconButton
                    onClick={handleRefresh}
                    sx={{
                        color: Colors.BLUE_PUBLIC_WORDS,
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        zIndex: 1,
                    }}
                    size="small"
                    disabled={loading}
                >
                    {
                        loading
                            ? <CircularProgress size="18px" sx={{ color: 'inherit' }} />
                            : <RefreshRoundedIcon sx={{ fontSize: 'inherit' }} />
                    }
                </IconButton>
            </Tooltip>
            <Grid container {...Props.GCRCC}>
                <Grid item xs={12} {...Props.GICCC} sx={{
                    height: width / 2,
                    maxHeight: 150,
                    backgroundColor: Colors.WOAD_YELLOW, px: 2, py: 1,
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width,
                        height: width / 2,
                        maxHeight: 150,
                    }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
                    <div style={{ position: 'absolute', zIndex: 1000, bottom: '0.5rem', left: '0.5rem' }}>
                        <Grid container {...Props.GCRCC}>
                            <Link href={authorUrl || '#'} passHref>
                                <Avatar
                                    src={authorImg}
                                    alt={author}
                                    sx={{
                                        cursor: 'pointer',
                                        boxShadow: '0px 0px 10px rgba(255,255,255,0.5)',
                                        width: 30,
                                        height: 30
                                    }}
                                />
                            </Link>
                            <Grid item {...Props.GOCCC}>

                            </Grid>
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
                            fontSize: Fonts.FS_16,
                            mr: 1
                        }} align="center">
                            Powered by
                        </Typography>
                        <div style={{ position: "relative", width: 80, height: 40 }}>
                            <LoadingImage
                                src={UNSPLASH_LOGO_X}
                                alt="Unsplash"
                                layout="fill"
                                objectFit="contain"
                                bgColor="transparent"
                                draggable={false}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default UnsplashWord;