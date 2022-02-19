import React, { useState } from 'react';

import Image from 'next/image';

import {
    Skeleton,
} from '@mui/material';

const Index = (props) => {

    const [loading, setLoading] = useState(true);

    if (!props?.src) {
        return <div>No Image Found!</div>
    }

    return (
        <>
            <div style={{
                position: 'relative', width: '100%',
                height: '100%', opacity: loading ? 0 : 1,
            }}>

                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image
                    {...props}
                    onLoadingComplete={() => setLoading(false)}
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