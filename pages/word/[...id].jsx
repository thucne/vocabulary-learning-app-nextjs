import React, { useState } from 'react';

import { withRouter } from 'next/router';

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

import words from "@components/Words/words";

const fetcher = async (...args) => await fetcherJWT(...args);

const RANDOM_QUERY = (word) => `https://api.unsplash.com/search/photos?query=${word}&per_page=1&client_id=${UNSPLASH}`;
const RANDOM_PHOTO = (word) => `https://source.unsplash.com/random?${word}`;


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
            pageSize: 10000
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

    const randomWord = words[Math.floor(Math.random() * words.length)];

    const { data = {} } = useSWR(getJWT() && id
        ? RANDOM_QUERY(randomWord)
        : null,
        fetcher,
        {
            refreshInterval: 1000,
        });
    let randomPhotoData = data;

    if (_.isEmpty(randomPhotoData?.results)) {
        randomPhotoData = {
            results: [
                {
                    urls: { regular: RANDOM_PHOTO(randomWord) }
                }
            ]
        }
    }


    if (loading && _.isEmpty(matchedVip)) {
        return (
            <Private>
                <Layout noMeta tabName={"Private word"}>
                    <Meta robots="noindex, follow" />
                    <LoadingOrNotFound />
                </Layout>
            </Private>
        )
    }

    if (!loading && _.isEmpty(matchedVip)) {
        return (
            <Private>
                <Layout noMeta tabName={"Private word"}>
                    <Meta robots="noindex, follow" />
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
            <Layout noMeta tabName={matchedVip?.vip}>
                <MetaTag vip={matchedVip} params={router?.query} />
                <PrivateWordComponent
                    vip={matchedVip}
                    params={router?.query}
                    relatedVips={randomSixRelatedVips}
                    unsplashVip={{
                        word: randomWord,
                        photo: randomPhotoData
                    }}
                />
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
            robots="noindex, follow"
        />
    )
};


export default withRouter(PrivateWord);