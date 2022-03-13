import React, { useState } from 'react';

import { withRouter } from 'next/router';

import Layout from "@layouts";
import Meta from "@meta";
import PrivateWordComponent from "@components/Words/Private";
import LoadingOrNotFound from '@components/Words/LoadingOrNotFound';
import ErrorPage from "@components/Error";

import { API } from '@config';
import { deepExtractObjectStrapi, sortRelatedVips, getJWT } from '@utils';
import Private from '@components/Auth/Private';
import { fetcherJWT } from '@actions';
import { Props, Fonts, Colors } from '@styles';
import { NO_PHOTO } from '@consts';

import qs from 'qs';

import {
    Skeleton, Typography, Container, Divider, Grid,
    Link as MuiLink
} from '@mui/material';

import useSWR from 'swr';
import _ from 'lodash';

const fetcher = async (...args) => await fetcherJWT(...args);

const PrivateWord = ({ router = { query: {} } }) => {
    const [loading, setLoading] = useState(true);

    const { id: [vip, id] } = _.isEmpty(router.query) ? { id: ['', ''] } : router.query;

    const querySearchRelated = {
        populate: '*',
        filters: {
            id: {
                $ne: id,
            }
        },
        pagination: {
            page: 1,
            pageSize: 1000
        }
    }

    // get words
    const { data: allVips = [] } = useSWR(getJWT() && id
        ? `${API}/api/vips?${qs.stringify(querySearchRelated, { encodeValuesOnly: true })}`
        : null,
        fetcher,
        {
            refreshInterval: 1000,
        });

    const { data: foundVip = {} } = useSWR(getJWT() && id
        ? `${API}/api/vips/${id}?populate=*`
        : null,
        fetcher,
        {
            refreshInterval: 1000,
            onSuccess: () => setLoading(false)
        });

    const vips = _.isArray(allVips?.data) ? allVips.data : (_.isObject(allVips?.data) ? [allVips.data] : []);

    const matchedVip = deepExtractObjectStrapi(foundVip, {
        minifyPhoto: ['illustration']
    });

    const relatedVips = vips?.filter(item => !id ? item.attributes.vip !== vip : item.id.toString() !== id);

    const formattedRelatedVips = relatedVips
        ?.map(item => deepExtractObjectStrapi(item, {
            minify: true,
            minifyFields: ['lastReview', 'lastReviewOK', 'antonyms', 'audio', 'createdAt', 'updatedAt'],
            minifyPhoto: ['illustration']
        }));

    const sortedRelatedVips = sortRelatedVips(matchedVip, formattedRelatedVips);

    const minifiedRelatedVips = sortedRelatedVips.map(item => deepExtractObjectStrapi(item, {
        minify: true,
        minifyFields: ['tags', 'meanings', 'examples', 'synonyms']
    }));

    const randomSixRelatedVips = minifiedRelatedVips.slice(0, 6);

    if (loading && _.isEmpty(matchedVip)) {
        return (
            <Private>
                <Layout tabName={"Private word"}>
                    <LoadingOrNotFound />
                </Layout>
            </Private>
        )
    }

    if (!loading && _.isEmpty(matchedVip)) {
        return (
            <Private>
                <Layout tabName={"Private word"}>
                    <ErrorPage
                        title="Not Found | VIP"
                        errorMessage="Word Not Found"
                        message="The word you are looking for does not exist."
                        illustration={NO_PHOTO}
                        redirectTo={{
                            title: "Dashboard",
                            link: "/dashboard",
                        }}
                    />
                </Layout>
            </Private>
        )
    }

    return (
        <Private>
            <Layout noMeta tabName={vip?.vip}>
                <MetaTag vip={matchedVip} params={router?.query} />
                <PrivateWordComponent vip={matchedVip} params={router?.query} relatedVips={randomSixRelatedVips} />
            </Layout>
        </Private>
    );
};

const MetaTag = ({ vip, params }) => {

    const photo = vip?.illustration;
    const firstMeaning = vip?.meanings?.english[0] || vip?.meanings?.vietnamese[0];

    return (
        <Meta
            title={`${vip?.vip} - VIP`}
            description={firstMeaning}
            image={photo}
            url={`/word/public/${params.id[0]}/${params.id[1]}`}
            canonical={`/word/public/${params.id[0]}/${params.id[1]}`}
            publishedTime={vip?.createdAt}
            modifiedTime={vip?.updatedAt}
        />
    )
};


export default withRouter(PrivateWord);