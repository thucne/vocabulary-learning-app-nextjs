import React, { useEffect } from 'react';

import {
    Container,
    Divider
} from '@mui/material';

import Welcome from './Welcome';
import WordListBlock from './WordListBlock';

import { fetcherJWT } from '@actions';
import { API } from '@config';

import useSWR from 'swr';
import { useDispatch, useSelector } from 'react-redux';
import * as t from '@consts';

const fetcher = async (...args) => await fetcherJWT(...args);

export default function DashboardPage(props) {
    const dispatch = useDispatch();

    const wordList = useSelector(state => state.userData?.wordList);

    // get words
    useSWR(`${API}/api/vips`, fetcher, {
        onSuccess: (data) => dispatch({
            type: t.UPDATE_USER_DATA, payload: {
                wordList: data?.data || []
            }
        }),
    });

    return (
        <Container maxWidth="lg">
            <Welcome />
            <Divider sx={{ width: '100%', my: 2 }} />
            <WordListBlock wordList={wordList} />
        </Container>
    )
}
