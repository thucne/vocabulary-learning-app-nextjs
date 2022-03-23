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
    minimizedGroups, setMinimizedGroups
 }) => {

    const [groupedVips, setGroupedVips] = useState([]);

    useEffect(() => {
        if (hasNext >= pageNumber) {
            const [inifiniteVips, hasNextPage] = getInfiniteVips(_.isArray(vips) && !_.isEmpty(vips) ? vips : [], pageNumber, PAGE_SIZE);
            const localGroupedVips = groupByDate(_.isArray(inifiniteVips) && !_.isEmpty(inifiniteVips) ? inifiniteVips : [],
                existingVips,
                setExistingVips,
                pageNumber
            );
            setHasNext(hasNextPage);
            setGroupedVips(localGroupedVips);
        }
    }, [existingVips, pageNumber, vips, setExistingVips, hasNext, setHasNext]);

    return <Grid container {...Props.GCRSC}>
        {groupedVips.map((group, index) => <Grid item xs={12} key={`wordlist-${index}`}>
            <EachGroup
                group={group}
                pageNumber={pageNumber}
                minimizedGroups={minimizedGroups}
                setMinimizedGroups={setMinimizedGroups}
            />
        </Grid>)}
    </Grid>
}

export default EachPage;