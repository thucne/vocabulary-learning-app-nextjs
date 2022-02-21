import React, { useEffect, useState } from 'react';

import {
    Container,
    Divider,
} from '@mui/material';

import Welcome from './Welcome';
import WordListBlock from './WordListBlock';

import { fetcherJWT } from '@actions';
import { API } from '@config';

import { useDispatch, useSelector } from 'react-redux';
import * as t from '@consts';

const fetcher = async (...args) => await fetcherJWT(...args);

export default function DashboardPage(props) {
    return (
        <Container maxWidth="lg">
            <Welcome />
            <Divider sx={{ width: '100%', my: 2 }} />
            <WordListBlock />
            <Divider sx={{ width: '100%', my: 2 }} />
        </Container>
    )
}

