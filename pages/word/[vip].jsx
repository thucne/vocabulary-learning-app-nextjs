import React, { useState } from 'react';

import { useRouter } from 'next/router';

import Layout from "@layouts";
import Meta from "@meta";
import PrivateWordComponent from "@components/Words/Private";
import LoadingOrNotFound from '@components/Words/LoadingOrNotFound';
import ErrorPage from "@components/Error";

import { API, UNSPLASH } from '@config';
import { deepExtractObjectStrapi, sortRelatedVips, getJWT } from '@utils';
import Private from '@components/Auth/Private';
import { fetcherJWT } from '@actions';
import { NO_PHOTO } from '@consts';

import qs from 'qs';
import useSWR from 'swr';
import _ from 'lodash';

const fetcher = async (...args) => await fetcherJWT(...args);

const AnyWord = () => {
    const { query: { vip } } = useRouter();

    const queryString = qs.stringify({
        filters: {
            vip: {
                $containsi: vip
            }
        },
        populate: '*',
        pagination: {
            page: 1,
            pageSize: 1000,
        },
    }, { encodeValuesOnly: true });

    const { data } = useSWR(vip ? `${API}/api/vips?${queryString}` : null, fetcher);

    console.log(data);

    return (
        <Layout noMeta tabName={vip}>
            <MetaTag vip={vip} />
        </Layout>
    )
}

const MetaTag = ({ vip }) => {

    return (
        <Meta
            title={`${vip} - VIP`}
            description={`Search result for ${vip}`}
            image="https://res.cloudinary.com/katyperrycbt/image/upload/v1647528420/nubm8hjjeusa9vszqx4i.jpg"
            url={`/word/${vip}`}
            canonical={`/word/${vip}`}
        />
    )
};


export default AnyWord;