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
        iconStyle = {},
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
        showScrollbar = false,
        React = {}
    } = props;

    const {
        isValidElement,
        useRef,
        useMemo,
        useEffect,
        useState,
        useLayoutEffect
    } = React;

    const hookConfig = {
        useState,
        useLayoutEffect,
        useEffect
    }

    const [invalidProps, setInvalidProps] = useState('');
    const [mounted, setMounted] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const { width } = useThisToGetSizesFromRef(myRef, {
        revalidate: 100,
        timeout: 500,
        ...hookConfig
    });
    const { left, width: gridWidth, height: gridHeight } = useThisToGetPositionFromRef(gridRef, {
        revalidate: 100,
        timeout: 500,
        ...hookConfig
    });
    const { width: windowWidth } = useWindowSize(hookConfig);

    useEffect(() => {
        if (getElementSizes && typeof getElementSizes === 'function') {
            getElementSizes({ width, height: gridHeight });
        }
    }, [width, gridHeight, getElementSizes]);

    const numberOfChildren = children?.length || 0;

    const stackLength = width * numberOfChildren;

    const lowerThreshold = left - width / 2;
    const upperThreshold = left + width / 2;

    const handleBackAction = async () => {
        // find which item is in the middle of the screen

        const wordIndex = itemRefs.current.findIndex(itemRef => {
            const { left: wordLeft } = itemRef.getBoundingClientRect();
            return (wordLeft > lowerThreshold && wordLeft < left) ||
                (wordLeft + width >= left && wordLeft + width > upperThreshold)

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

        const wordIndex = itemRefs.current.findIndex(itemRef => {
            const { left: wordLeft } = itemRef.getBoundingClientRect();
            return (wordLeft > lowerThreshold && wordLeft < left) ||
                (wordLeft + width >= left && wordLeft + width > upperThreshold)
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

            const wordIndex = itemRefs?.current?.findIndex((itemRef, index) => {
                const { left: wordLeft } = itemRef?.getBoundingClientRect();

                return (wordLeft > lowerThreshold && wordLeft < left) ||
                    (wordLeft + width >= left && wordLeft + width > upperThreshold)
            });


            if (wordIndex > 0 && wordIndex < itemRefs.current.length - 1) {
                const itemRef = itemRefs?.current?.[wordIndex];

                const { left: wordLeft } = itemRef?.getBoundingClientRect();

                const a = Math.abs(left);
                const b = Math.abs(wordLeft);
                const whichBigger = Math.max(a, b);
                const different = Math.round(Math.abs(a - b) * 100 / whichBigger);

                if (different > 2) {
                    gridRef?.current?.scrollTo({
                        left: (wordIndex) * width,
                        behavior: 'smooth'
                    });
                }
            }

        };
        autoScroll();
    }, debounceTime), [left, width, debounceTime, lowerThreshold, upperThreshold]);

    const onScroll = () => {
        debounceScroll();
    }

    const EachItem = ({ width, itemRefs, index, children, elementStyle = {}, Grid, isValidGrid }) => {
        if (!isValidGrid) {
            return <div>Invalid Grid</div>
        }
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
                    <IconButton aria-label="left" onClick={handleBackAction} sx={buttonIconStyle}>
                        <ArrowBackIcon fontSize="large" sx={iconStyle} />
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
                        <ArrowForwardIcon fontSize="large" sx={iconStyle} />
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
                        '::-webkit-scrollbar': {
                            width: showScrollbar ? '10px' : '0px',
                            height: showScrollbar ? '10px' : '0px'
                        }
                    }}
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
                                isValidGrid={isValidElement(<Grid />)}
                                React={React}
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

export default ScrollPages;