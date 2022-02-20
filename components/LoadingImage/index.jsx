import React, { useState } from 'react';

import Image from 'next/image';

import {
    Skeleton,
} from '@mui/material';
import { useTheme } from "@mui/material/styles";

const Index = (props) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);

    if (!props?.src) {
        return <div>No Image Found!</div>
    }

    const {
        doneLoading,
        ...imgProps
    } = props;

    return (
        <>
            <div style={{
                position: 'relative', width: '100%',
                height: '100%', opacity: loading ? 0 : 1,
                backgroundColor: theme.palette.img_bg.main
            }}>

                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image
                    {...imgProps}
                    onLoadingComplete={() => {
                        setLoading(false);
                        if (typeof props?.doneLoading === 'function') {
                            props?.doneLoading();
                        }
                    }}
                />
            </div>
            {
                loading && <Skeleton sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, #64b5f6 0%, #ffd54f 100%)'
                }} variant="rectangular" animation="wave" />
            }
            {
                loading && <div style={{
                    position: 'absolute',
                    width: 100,
                    height: 100,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%'
                    }}>
                        <Image
                            src='https://res.cloudinary.com/katyperrycbt/image/upload/v1645240546/Dual_Ball-1s-200px_tbjrjw.svg'
                            alt='Loading'
                            layout='fill'
                            objectFit='cover'
                            loading="eager"
                            draggable={false}
                        />
                    </div>
                </div>
            }
        </>
    );
};

export default Index;