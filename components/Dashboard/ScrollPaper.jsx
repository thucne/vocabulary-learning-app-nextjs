// import React, { useRef, useMemo, useEffect, useState } from 'react';

import { useThisToGetSizesFromRef, useThisToGetPositionFromRef, useWindowSize } from '@utils';

import { debounce } from 'lodash';


const muiItemsName = [
    'Container',
    'Grid',
    'IconButton',
    'Stack',
    'ArrowBackIcon',
    'ArrowForwardIcon'
];

const ScrollPages = (props) => {

    const {
        children,
        debounceTime = 250,
        elementStyle = {},
        containerStyle = {},
        buttonStyle = {},
        buttonIconStyle = {},
        gridItemSize: {
            xs, sm, md, lg
        } = {},
        mui: {
            Container,
            Grid,
            IconButton,
            Stack,
            ArrowBackIcon,
            ArrowForwardIcon
        },
        getElementSizes,
        react: {
            React = {},
        }
    } = props;

    const {
        isValidElement,
        useRef,
        useMemo,
        useEffect,
        useState
    } = React;

    const [invalidProps, setInvalidProps] = useState('');
    const [mounted, setMounted] = useState(0);

    useEffect(() => {
        [
            Container,
            Grid,
            IconButton,
            Stack,
            ArrowBackIcon,
            ArrowForwardIcon,
        ].
            forEach((Component, index) => {
                if (!Component || !isValidElement(<Component />)) {
                    setInvalidProps(`${muiItemsName[index]} is not a valid react component`);
                }
                setMounted(prev => prev + 1);
            })
    }, [Container, Grid, IconButton, Stack, ArrowBackIcon, ArrowForwardIcon, setInvalidProps, setMounted, isValidElement]);

    const myRef = useRef(null);
    const gridRef = useRef(null);
    const itemRefs = useRef([]);

    const { width } = useThisToGetSizesFromRef(myRef, { revalidate: 100, timeout: 500 });
    const { left, width: gridWidth, height: gridHeight } = useThisToGetPositionFromRef(gridRef, { revalidate: 100, timeout: 500 });
    const { width: windowWidth } = useWindowSize();

    useEffect(() => {
        if (getElementSizes && typeof getElementSizes === 'function') {
            getElementSizes({ width, height: gridHeight });
        }
    }, [width, gridHeight, getElementSizes]);

    const numberOfChildren = children?.length || 0;

    const stackLength = width * numberOfChildren;

    const handleBackAction = async () => {
        // find which item is in the middle of the screen
        const halfOfScreen = windowWidth / 2;

        const wordIndex = itemRefs.current.findIndex(itemRef => {
            const { left: wordLeft } = itemRef.getBoundingClientRect();
            return (wordLeft < halfOfScreen && wordLeft > 0) ||
                (wordLeft + width > halfOfScreen && wordLeft + width < windowWidth);
        });

        // scroll left
        if (wordIndex > 0) {
            const itemRef = itemRefs.current[wordIndex - 1];
            const { left: wordLeft } = itemRef.getBoundingClientRect();

            gridRef.current.scrollTo({
                left: wordLeft + wordIndex * width - left,
                behavior: 'smooth'
            });
        }
    }

    const handleForwardAction = async () => {
        // find which item is in the middle of the screen
        const halfOfScreen = windowWidth / 2;

        const wordIndex = itemRefs.current.findIndex(itemRef => {
            const { left: wordLeft } = itemRef.getBoundingClientRect();
            return (wordLeft < halfOfScreen && wordLeft > 0) ||
                (wordLeft + width > halfOfScreen && wordLeft + width < windowWidth);
        });

        // scroll left
        if (wordIndex < itemRefs.current?.length - 1) {
            const itemRef = itemRefs.current[wordIndex + 1];
            const { left: wordLeft } = itemRef.getBoundingClientRect();

            gridRef.current.scrollTo({
                left: wordLeft + wordIndex * width - left,
                behavior: 'smooth'
            });
        }
    }

    const debounceScroll = useMemo(() => debounce(() => {
        const autoScroll = async () => {
            const halfOfScreen = windowWidth / 2;

            const wordIndex = itemRefs?.current?.findIndex(itemRef => {
                const { left: wordLeft } = itemRef?.getBoundingClientRect();
                return (wordLeft < halfOfScreen && wordLeft > 0) ||
                    (wordLeft + width > halfOfScreen && wordLeft + width < windowWidth);
            });

            const itemRef = itemRefs?.current?.[wordIndex];

            if (itemRef) {
                const { left: wordLeft } = itemRef?.getBoundingClientRect();

                const a = Math.abs(wordIndex * width - left);
                const b = Math.abs(wordLeft);
                const whichBigger = Math.max(a, b);
                const different = Math.round(Math.abs(a - b) * 100 / whichBigger);

                if (different > 10) {
                    gridRef?.current?.scrollTo({
                        left: wordLeft + (wordIndex * width - wordLeft),
                        behavior: 'smooth'
                    });
                }
            }

        };
        autoScroll();
    }, debounceTime), [left, width, windowWidth, debounceTime]);

    const onScroll = () => {
        debounceScroll();
    }

    if (invalidProps?.length || mounted !== 6) {
        return <div>{invalidProps}</div>
    }

    return (
        <Container maxWidth="lg" disableGutters>
            <Grid container direction="row" mt={[0, 1, 2, 3]} sx={{
                position: 'relative',
                ...containerStyle
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: `0px`,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    zIndex: 10,
                    ...buttonStyle
                }} >
                    <IconButton aria-label="left" onClick={handleBackAction}>
                        <ArrowBackIcon fontSize="large" sx={buttonIconStyle} />
                    </IconButton>
                </div>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: `calc(${gridWidth}px)`,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    zIndex: 10,
                    ...buttonStyle
                }}>
                    <IconButton aria-label="left" onClick={handleForwardAction} sx={buttonIconStyle}>
                        <ArrowForwardIcon fontSize="large" />
                    </IconButton>
                </div>
                <Grid
                    ref={gridRef}
                    item
                    xs={12}
                    sx={{
                        mt: 1,
                        width: [width],
                        overflow: 'auto',
                        borderRadius: '10px',
                    }}
                    className='hideScrollBar'
                    onScroll={onScroll}
                >
                    <Stack direction="row" sx={{ width: stackLength }}>
                        {numberOfChildren > 0 && children.map((eachChild, index) => (
                            <EachItem
                                key={`render-item-list-${index}`}
                                width={width}
                                itemRefs={itemRefs}
                                index={index}
                                elementStyle={elementStyle}
                                Grid={Grid}
                            >
                                {eachChild}
                            </EachItem>
                        ))}
                    </Stack>
                    <Grid container direction='row'>
                        <Grid ref={myRef} item xs={xs || 12} sm={sm || 6} md={md || 4} lg={lg || 3}></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container >
    );

};

const EachItem = ({ width, itemRefs, index, children, elementStyle = {}, Grid }) => {
    return <Grid
        ref={el => itemRefs.current[index] = el}
        container
        direction='column'
        alignItems='center'
        wrap='nowrap'
        sx={{
            p: 1,
            width,
            height: 'auto',
            '&:hover': {
                filter: 'brightness(50%)'
            },
            ...elementStyle
        }}
    >
        {children}
    </Grid>
}

export default ScrollPages;