import React, { useState } from 'react';

import { useRouter } from 'next/router';

import Layout from "@layouts";
import Meta from "@meta";
import AnyWordComponent from '@components/Words';
import LoadingOrNotFound from '@components/Words/LoadingOrNotFound';

import { API } from '@config';
import { fetcherJWTIfAny } from '@actions';
import { NO_PHOTO } from '@consts';

import qs from 'qs';
import useSWR from 'swr';
import _ from 'lodash';

const fetcher = async (...args) => await fetcherJWTIfAny(...args);

const AnyWord = () => {
    const { query: { vip } } = useRouter();
    const [loading, setLoading] = useState(true);

    const queryString = qs.stringify({
        max: 10
    }, { encodeValuesOnly: true });

    const { data } = useSWR(vip ? `${API}/api/fuzzy-search/${vip}?${queryString}` : null, fetcher, {
        onSuccess: () => setLoading(false),
    });

    const results = _.isArray(data?.data) && !_.isEmpty(data?.data) ? data.data : [];

    if (loading && _.isEmpty(results)) {
        return (
            <Layout noMeta tabName={"Private word"}>
                <MetaTag vip={vip} />
                <LoadingOrNotFound />
            </Layout>
        )
    }

    return (
        <Layout noMeta tabName={vip}>
            <MetaTag vip={vip} />
            <AnyWordComponent results={results} />
        </Layout>
    )
}

const MetaTag = ({ vip = 'Loading...' }) => {

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