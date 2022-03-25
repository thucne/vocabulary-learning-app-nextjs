import React, { useState, useEffect, useCallback } from 'react';

import {
    Grid, Paper, Typography, IconButton,
    Divider, Chip, Button, Checkbox,
    FormControlLabel, FormGroup, FormControl,
    MenuItem, CircularProgress, Grow, Collapse
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

import { Colors, Props, SXs, Fonts } from '@styles';

import EachWord from './EachWord';
import _ from 'lodash';

import { useDispatch } from 'react-redux';
import * as t from '@consts';
import { RECAPTCHA } from '@config';
import { deleteManyVIPs } from '@actions';

const EachGroup = ({
    group, pageNumber,
    minimizedGroups, setMinimizedGroups,
    checkedAllGroups, setCheckedAllGroups,
    sumUpGroups, setSumUpGroups,
    indeterminateGroups, setIndeterminateGroups,
    currentWord, setCurrentWord,
    isLastGroup, setIsLoading,
    isFistGroup
}) => {
    const dispatch = useDispatch();

    const [selectedVips, setSelectedVips] = useState([]);
    const [localCheckAllGroups, setLocalCheckAllGroups] = useState([]);
    const [previousExist, setPreviousExist] = useState(false);
    const [loading, setLoading] = useState(false);

    const vips = group.data;
    const label = group.date;
    const displayLabel = group.isDisplay;
    const totalVips = _.groupBy(sumUpGroups, 'label')?.[label]?.reduce((acc, cur) => acc + cur.count, 0);
    const vipIds = _.groupBy(sumUpGroups, 'label')?.[label]?.reduce((acc, cur) => acc.concat(cur.ids), []);
    const isIndeterminate = indeterminateGroups?.[label]?.length > 0
        && indeterminateGroups?.[label]?.length < totalVips;
    const numberOfSelectedVips = indeterminateGroups?.[label]?.length;
    const indeterminateSelectedVips = indeterminateGroups?.[label];

    useEffect(() => {
        if (!_.isEqual(checkedAllGroups, localCheckAllGroups) && previousExist !== checkedAllGroups.includes(label)) {
            if (checkedAllGroups.includes(label)) {
                setSelectedVips(vips.map(item => item.id));
            } else {
                setSelectedVips([]);
            }
            setLocalCheckAllGroups(checkedAllGroups);
            setPreviousExist(checkedAllGroups.includes(label))
        }
    }, [checkedAllGroups, label, vips, setSelectedVips, localCheckAllGroups, setLocalCheckAllGroups, previousExist]);

    useEffect(() => isLastGroup && setIsLoading(false), [isLastGroup, setIsLoading]);

    const toggleSelected = (id) => {

        setSelectedVips(prev => {
            let newVal = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
            let isFilterOut = prev.includes(id);

            // check selected in indeterminate
            setIndeterminateGroups(prev => {
                let rs = _.uniq([...(prev?.[label] || []), ...newVal]).filter(item => isFilterOut ? item !== id : true);

                if (rs.length === totalVips) {
                    const newCheckedAllGroups = checkedAllGroups.includes(label) ? checkedAllGroups : [...checkedAllGroups, label];
                    setCheckedAllGroups(newCheckedAllGroups);
                }

                if (rs.length === 0) {
                    const newCheckedAllGroups = checkedAllGroups.includes(label) ? checkedAllGroups.filter(item => item !== label) : checkedAllGroups;
                    setCheckedAllGroups(newCheckedAllGroups);
                }

                return {
                    ...prev,
                    [label]: rs
                }
            });

            return newVal;
        });
    }


    const checkIndeterminate = (newCheckedAllGroups) => {
        if (newCheckedAllGroups.includes(label)) {
            setIndeterminateGroups(prev => ({
                ...prev,
                [label]: vipIds
            }))
        } else {
            setIndeterminateGroups(prev => ({
                ...prev,
                [label]: []
            }))
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();

        const nextAction = () => {

            if (window?.adHocFetch && window?.grecaptcha) {
                window.grecaptcha.ready(function () {
                    window.grecaptcha
                        .execute(`${RECAPTCHA}`, { action: "vip_authentication" })
                        .then(function (token) {
                            adHocFetch({
                                dispatch,
                                action: deleteManyVIPs({ token, data: indeterminateSelectedVips }),
                                onSuccess: () => {
                                    dispatch({ type: t.HIDE_CONFIRM_DIALOG });
                                    dispatch({ type: t.FORCE_RELOAD });
                                },
                                onError: (error) => console.log(error),
                                onStarting: () => setLoading(true),
                                onFinally: () => setLoading(false),
                                snackbarMessageOnSuccess: "Delete!",
                            });
                        });
                });
            }
        }

        dispatch({
            type: t.SHOW_CONFIRM_DIALOG,
            payload: {
                title: "Warning",
                message: "Are you sure you want to delete selected words? This action cannot be undone.",
                onNext: nextAction,
                nextText: "Delete",
                type: 'danger'
            }
        })
    }

    return (
        <Grid container {...Props.GCRCC}>
            {
                displayLabel && label && <Grid item xs={12} {...Props.GICCS} mx={1} my={0.5}>
                    <Divider sx={{ width: '100%', my: 2 }}>
                        <Button
                            size="small"
                            variant="outlined"
                            sx={{
                                ...SXs.COMMON_BUTTON_STYLES,
                                borderRadius: '10px'
                            }}
                            endIcon={!minimizedGroups.includes(label) ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                            onClick={() => {
                                const newMinimizedGroups = minimizedGroups.includes(label) ? minimizedGroups.filter(g => g !== label) : [...minimizedGroups, label];
                                setMinimizedGroups(newMinimizedGroups);
                            }}
                        >
                            {label}
                        </Button>
                    </Divider>
                </Grid>
            }
            <Collapse in={!minimizedGroups.includes(label)} sx={{ width: '100%' }}>
                {
                    displayLabel && label && (
                        <Grid item xs={12} {...Props.GICCS} mx={1} my={0.5}>
                            <Paper variant="outlined" sx={{
                                borderColor: 'transparent', pr: 1, pl: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                            }}>
                                <FormControlLabel
                                    label={numberOfSelectedVips > 0 ? `${numberOfSelectedVips} selected` : "Select all"}
                                    control={<Checkbox
                                        checked={checkedAllGroups.includes(label)}
                                        onChange={() => {
                                            const newCheckedAllGroups = checkedAllGroups.includes(label) ? checkedAllGroups.filter(g => g !== label) : [...checkedAllGroups, label];
                                            setCheckedAllGroups(newCheckedAllGroups);
                                            checkIndeterminate(newCheckedAllGroups);
                                        }}
                                        indeterminate={isIndeterminate}
                                    />}
                                    sx={{ m: 0, mr: 1 }}
                                />
                                {
                                    numberOfSelectedVips > 0 && <IconButton
                                        aria-label='Delete selected'
                                        disabled={loading}
                                        onClick={handleDelete}
                                        color='primary'
                                    >
                                        {
                                            !loading ? <DeleteForeverRoundedIcon fontSize="inherit" /> : <CircularProgress size={22} />
                                        }
                                    </IconButton>
                                }
                            </Paper>
                        </Grid>
                    )
                }
                <Grid item xs={12}>
                    <Grid container {...Props.GCRCC}>
                        {
                            vips.map((vip, index) => <Grid item xs={12} key={`wordlist-${pageNumber}-${index}`}>
                                <EachWord
                                    vip={vip}
                                    selectedVips={selectedVips}
                                    setSelectedVips={toggleSelected}
                                    currentWord={currentWord}
                                    setCurrentWord={setCurrentWord}
                                />
                            </Grid>)
                        }
                    </Grid>
                </Grid>
                {
                    isLastGroup && <Grid item xs={12} {...Props.GIRSC} ml={1}>
                        <div
                            style={{ width: 10, height: 10, backgroundColor: Colors.LOGO_BLUE, borderRadius: '50%', marginRight: 5 }}
                        />
                        <Typography variant="caption" color="textSecondary">
                            Meanings
                        </Typography>
                        <div
                            style={{ width: 10, height: 10, backgroundColor: Colors.LOGO_YELLOW, borderRadius: '50%', marginRight: 5, marginLeft: 15 }}
                        />
                        <Typography variant="caption" color="textSecondary">
                            Examples
                        </Typography>
                    </Grid>
                }
            </Collapse>
        </Grid>
    );
};

export default EachGroup;