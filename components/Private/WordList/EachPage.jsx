import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { Grid } from '@mui/material';

import EachGroup from './EachGroup';

import {
    getInfiniteVips,
    groupByDate,
} from '@utils';

import { Props } from '@styles';

import _ from 'lodash';

const PAGE_SIZE = 4;

const EachPage = ({
    vips, pageNumber,
    existingVips, setExistingVips,
    hasNext, setHasNext,
    minimizedGroups, setMinimizedGroups,
    checkedAllGroups, setCheckedAllGroups,
    indeterminateGroups, setIndeterminateGroups,
    sumUpGroups, setSumUpGroups,
    currentWord, setCurrentWord,
    isLastPage, setIsLoading
}) => {

    const [groupedVips, setGroupedVips] = useState([]);

    useEffect(() => {
        const [inifiniteVips, hasNextPage] = getInfiniteVips(_.isArray(vips) && !_.isEmpty(vips) ? vips : [], pageNumber, PAGE_SIZE);
        const localGroupedVips = groupByDate(_.isArray(inifiniteVips) && !_.isEmpty(inifiniteVips) ? inifiniteVips : [],
            existingVips,
            setExistingVips,
            pageNumber
        );
        if (isLastPage) {
            setHasNext(hasNextPage);
        };
        setGroupedVips(localGroupedVips);
    }, [existingVips, pageNumber, vips, setExistingVips, hasNext, setHasNext, isLastPage]);

    useEffect(() => {
        groupedVips.forEach((group) => {
            let conditionA = sumUpGroups.findIndex(item => item.label === group.date && item.id === pageNumber) === -1;
            let conditionB = !_.isEqual(sumUpGroups, [
                ...sumUpGroups,
                {
                    id: pageNumber,
                    label: group.date,
                    count: group.data.length,
                    ids: group.data.map(item => item.id)
                }]);

            if (conditionA && conditionB) {
                setSumUpGroups(prev => _.uniqWith([
                    ...prev, {
                        id: pageNumber,
                        label: group.date,
                        count: group.data.length,
                        ids: group.data.map(item => item.id)
                    }], _.isEqual));
            }
        })
    }, [groupedVips, pageNumber, sumUpGroups, setSumUpGroups]);

    const groupProps = {
        minimizedGroups, setMinimizedGroups,
        checkedAllGroups, setCheckedAllGroups,
        indeterminateGroups, setIndeterminateGroups,
        sumUpGroups, setSumUpGroups,
        currentWord, setCurrentWord,
        setIsLoading
    }

    return <Grid container {...Props.GCRSC}>
        {
            groupedVips.map((group, index) => <Grid item xs={12} key={`wordlist-${index}`}>
                <EachGroup
                    group={group}
                    pageNumber={pageNumber}
                    isLastGroup={index === groupedVips.length - 1 && isLastPage}
                    isFistGroup={index === 0 && pageNumber === 0}
                    {...groupProps}
                />
            </Grid>)
        }
    </Grid>
}

export default EachPage;