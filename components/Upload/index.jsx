import { useState, useRef, useEffect } from 'react';

import {
    Grid, Typography, IconButton
} from '@mui/material';

import { Colors } from '@styles';

import Image from 'next/image';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

const GridDragAndDrop = styled(Grid)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    borderRadius: theme.spacing(1),
    zIndex: 3,
    [theme.breakpoints.down('md')]: {
        marginRight: 0,
        marginLeft: 0,
    },
    '&.onDragging': {
        backgroundColor: Colors.GREY_200,
        filter: 'brightness(0.5)'
    }
}));

const Input = styled('input')({
    display: 'none',
});

const UploadComponent = ({
    setData, setFileName, setSize, styles, CustomIcon,
    showDelete, stylesImage, stylesImage2,
    clickWhole, showIconUpload, data,
    isFormik
}) => {
    const [dragging, setDragging] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [photo, setPhoto] = useState('');
    const upLoadRef = useRef(null);

    useEffect(() => {
        if (data) {
            setPhoto(data);
        };
    }, [data]);

    const handleChange = (e) => {
        // console.log(e.target.value);
        if (e.target.files && e.target.files[0] && !e.target.files[0].type.includes('image/')) {
            dispatch({ type: t.SHOW_SNACKBAR, payload: { message: 'Only image file is allowed', type: 'error' } });
            return;
        }
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            const fileName = e.target.files[0].name;
            const file = e.target.files[0];
            reader.onload = async (e) => {
                setPhoto(e.target.result);
                setLoadingImage(true);
                if (setFileName) {
                    setFileName(fileName);
                }
                if (setSize) {
                    const newImg = new window.Image();
                    newImg.src = e.target.result;
                    newImg.onload = function () {
                        setSize({ width: this.width, height: this.height });
                    }
                }
                if (setData) {
                    if (isFormik) {
                        setData(file, e.target.result);
                    } else {
                        setData(e.target.result);
                    }
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const dropHandler = (ev) => {
        setDragging(false);

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    var file = ev.dataTransfer.items[i].getAsFile();
                    if (file.type.includes('image/')) {
                        let reader = new FileReader();
                        reader.onload = async (e) => {
                            setPhoto(e.target.result);
                            setLoadingImage(true);
                            if (setFileName) {
                                setFileName(file.name);
                            }
                            if (setSize) {
                                const newImg = new window.Image();
                                newImg.src = e.target.result;
                                newImg.onload = function () {
                                    setSize({ width: this.width, height: this.height });
                                }
                            }
                            if (setData) {
                                if (isFormik) {
                                    setData(file, e.target.result);
                                } else {
                                    setData(e.target.result);
                                }
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        dispatch({ type: t.SHOW_SNACKBAR, payload: { message: 'Only image file is allowed', type: 'error' } });
                    }
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.files.length; i++) {
                if (ev.dataTransfer.files[i].type.includes('image/')) {
                    let reader = new FileReader();
                    reader.onload = async (e) => {
                        setPhoto(e.target.result);
                        setLoadingImage(true);
                        if (setFileName) {
                            setFileName(ev.dataTransfer.files[i].name);
                        }
                        if (setSize) {
                            const newImg = new window.Image();
                            newImg.src = e.target.result;
                            newImg.onload = function () {
                                setSize({ width: this.width, height: this.height });
                            }
                        }
                        if (setData) {
                            if (isFormik) {
                                setData(ev.dataTransfer.files[i], e.target.result);
                            } else {
                                setData(e.target.result);
                            }
                        }
                    };
                    reader.readAsDataURL(ev.dataTransfer.files[i]);
                } else {
                    dispatch({ type: t.SHOW_SNACKBAR, payload: { message: 'Only image file is allowed', type: 'error' } });
                }
            }
        }
    }

    const dragOverHandler = (ev) => {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    const dragLeaveHandler = (ev) => {
        setDragging(false);
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    const dragEnterHandler = (ev) => {
        setDragging(true);
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    return <Grid {...styles} onClick={() => {
        if (clickWhole && upLoadRef?.current) {
            upLoadRef.current.click();
        }
    }}>
        <GridDragAndDrop
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
            onDragLeave={dragLeaveHandler}
            onDragEnter={dragEnterHandler}
            item
            xs={12}
            display='flex'
            alignItems='center'
            justifyContent='center'
            className={clsx({ 'onDragging': dragging })}
        >
        </GridDragAndDrop>
        {
            photo?.length > 0 &&
            <div style={{
                borderRadius: '50%',
                overflow: 'hidden',
                width: 200,
                height: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }} {...stylesImage}>
                <div style={{
                    display: loadingImage ? 'none' : 'flex',
                    overflow: 'hidden',
                    position: 'relative',
                }} {...stylesImage2}>
                    {
                        showDelete && <IconButton
                            sx={{
                                position: 'absolute',
                                top: 0, right: 0,
                                zIndex: 10,
                                opacity: 0.5,
                                '&:hover': {
                                    opacity: 1,
                                }
                            }}
                            onClick={() => {
                                setLoadingImage(false);
                                setPhoto('');
                            }}
                            aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    }
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Image
                            src={photo}
                            alt='Photo'
                            layout='fill'
                            quality={100}
                            objectFit='cover'
                            onLoadingComplete={() => setLoadingImage(false)}
                            priority={true}
                        />
                    </div>
                </div>
            </div>
        }
        <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
            <label htmlFor="icon-button-file">
                <Input onChange={handleChange} ref={upLoadRef} accept="image/*" id="icon-button-file" type="file" />
                <IconButton
                    sx={{
                        '&:hover': {
                            backgroundColor: 'transparent'
                        },
                        '&.onDragging': {
                            backgroundColor: Colors.GREY_200,
                            filter: 'brightness(0.5)'
                        }
                    }}
                    disableFocusRipple={true} disableRipple={true}
                    color="primary" aria-label="upload picture" component="span"
                >
                    {
                        !photo?.length > 0 && showIconUpload && (
                            CustomIcon ? <CustomIcon style={{
                                width: 100, height: 100, backgroundColor: Colors.GREY_400,
                                borderRadius: '50%', padding: 10, color: 'white',
                            }} />
                                :
                                <UploadFileIcon
                                    style={{
                                        width: 100, height: 100, backgroundColor: Colors.GREY_400,
                                        borderRadius: '50%', padding: 10, color: 'white',
                                    }}
                                />
                        )
                    }
                </IconButton>
            </label>
        </Grid>
        {!photo && showIconUpload && <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
            <Typography variant='caption' sx={{ maxWidth: '200px' }} align='center'>Select a photo from the gallery or drag and drop it here.</Typography>
        </Grid>}
    </Grid>
}

export default UploadComponent;
