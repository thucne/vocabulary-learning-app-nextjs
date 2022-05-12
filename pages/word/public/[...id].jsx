import React, { useCallback, useState, useMemo } from 'react';

import { useRouter } from 'next/router';

import Layout from "@layouts";
import Meta from "@meta";
import PublicWordComponent from "@components/Words/Public";
import ErrorPage from "@components/Error";

import { API, UNSPLASH } from '@config';
import { deepExtractObjectStrapi, getNRelatedVips, encodeImageToBlurhash, toDataURL } from '@utils';

import { NO_PHOTO } from '@consts';

import qs from 'qs';
import _ from 'lodash';

import words from "@components/Words/words";
import useSWR from 'swr';

import { fetcherJWTIfAny } from '@actions';
const fetcher = async (...args) => await fetcherJWTIfAny(...args);

const PublicWord = ({ vip: buildVip, params: buildParams }) => {
    const router = useRouter();
    const { id: [word, id] } = router?.query;
    const [loading, setLoading] = useState(true);

    const { data: foundVip } = useSWR(id ? `${API}/api/vips/${id}?populate=*` : null, fetcher, {
        onSuccess: () => setLoading(false)
    });

    const matchedVip = deepExtractObjectStrapi(foundVip, {
        minifyPhoto: ['illustration']
    });

    const randomSixRelatedVips = useMemo(async () =>
        _.isObject(matchedVip) && !_.isEmpty(matchedVip) && await getNRelatedVips(matchedVip, 6), [matchedVip]);

    const randomWord = words[Math.floor(Math.random() * words.length)];


    const randomPhoto = useMemo(async () => await fetch(RANDOM_QUERY(randomWord)), [randomWord]);
    let randomPhotoData = useMemo(async () => _.isFunction(randomPhoto?.json) && await randomPhoto.json().catch(err => console.log(err)) || {}, [randomPhoto]);

    const localRes = useMemo(async () => _.isEmpty(randomPhotoData?.results) && await fetch(GET_LOCAL_UNSPLASH(randomWord)), [randomWord, randomPhotoData?.results]);
    const localData = useMemo(async () => _.isFunction(localRes.json) && await localRes.json().catch(() => ({})), [localRes]);

    const handledData = deepExtractObjectStrapi(localData)?.[0];

    // random
    let url = !_.isEmpty(handledData) && handledData.urls[Math.floor(Math.random() * handledData.urls.length)];

    randomPhotoData = {
        results: [
            {
                urls: { regular: url }
            }
        ]
    }

    const res = useMemo(async () => _.isEmpty(handledData) && await fetch(RANDOM_PHOTO(randomWord)), [randomWord, handledData]);

    // get unsplash id from url
    if (res) {
        url = res.url;

        randomPhotoData = {
            results: [
                {
                    urls: { regular: url }
                }
            ]
        }
    }

    // save to cms
    useCallback(async () => {
        if (_.isEmpty(handledData)) {
            await fetch(UPDATE_UNSPLASH(randomWord), {
                method: 'PUT',
                body: JSON.stringify({ url }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }, [randomWord, url, handledData])

    let localProps = {
        vip: matchedVip,
        relatedVips: randomSixRelatedVips || [],
        unsplashVip: {
            word: randomWord,
            photo: randomPhotoData
        },
        params: {
            id: id
        }
    }

    const { vip, relatedVips, unsplashVip, params } = localProps;

    if (loading && _.isEmpty(vip)) {
        return (
            <Layout tabName={buildVip?.vip || "Loading..."}>
                <MetaTag vip={buildVip} params={buildParams} />
            </Layout>
        )
    }

    if (!loading && _.isEmpty(vip)) {
        <Layout tabName="Not Found">
            <MetaTag vip={buildVip} params={buildParams} />
            <ErrorPage
                title="Word Not Found | VIP"
                errorMessage="Not Found"
                message="The word you are looking for does not exist."
                illustration={NO_PHOTO}
                redirectTo={{
                    title: "Dashboard",
                    link: "/dashboard",
                }}
            />
        </Layout>
    }

    return (
        <Layout noMeta tabName={vip?.vip || buildVip?.vip}>
            <MetaTag vip={vip || buildVip} params={params || buildParams} />
            {!_.isEmpty(vip) && <PublicWordComponent vip={vip} params={params} relatedVips={relatedVips} unsplashVip={unsplashVip} />}
        </Layout>
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
            url={`/word/public/${params?.id?.[0]}/${params?.id?.[1]}`}
            canonical={`/word/public/${params?.id?.[0]}/${params?.id?.[1]}`}
            publishedTime={vip?.createdAt}
            modifiedTime={vip?.updatedAt}
        />
    )
};

export async function getStaticPaths() {

    const querySearchRelated = {
        pagination: {
            limit: -1
        }
    }

    const res = await fetch(`${API}/api/vips?${qs.stringify(querySearchRelated, { encodeValuesOnly: true })}`);
    const data = (await res.json()).data;

    const paths = !!data?.length ? data.map(item => ({ params: { id: [item.attributes.vip, item.id.toString()] } })) : [];

    return {
        paths,
        fallback: 'blocking',
    };
}

const RANDOM_QUERY = (word) => `https://api.unsplash.com/search/photos?query=${word}&per_page=1&client_id=${UNSPLASH}`;
const RANDOM_PHOTO = (word) => `https://source.unsplash.com/random?${word}`;
const UPDATE_UNSPLASH = (word) => `${API}/api/unsplashes/update-keyword/${word}`;
const GET_LOCAL_UNSPLASH = (word) => `${API}/api/unsplashes?word=${word}`;

export async function getStaticProps(ctx) {

    const { id: [vip, id] } = ctx.params;

    const foundVipRaw = await fetch(`${API}/api/vips/${id}?populate=*`);
    const foundVip = await foundVipRaw.json();

    const matchedVip = deepExtractObjectStrapi(foundVip, {
        minifyPhoto: ['illustration']
    });

    // const randomSixRelatedVips = _.isObject(matchedVip) && !_.isEmpty(matchedVip) && await getNRelatedVips(matchedVip, 6);

    // const randomWord = words[Math.floor(Math.random() * words.length)];

    // const randomPhoto = await fetch(RANDOM_QUERY(randomWord));
    // let randomPhotoData = await randomPhoto?.json().catch(err => console.log(err)) || {};

    // if (_.isEmpty(randomPhotoData?.results)) {

    //     const localRes = await fetch(GET_LOCAL_UNSPLASH(randomWord));
    //     const localData = await localRes.json().catch(() => ({}));

    //     const handledData = deepExtractObjectStrapi(localData)?.[0];

    //     if (!_.isEmpty(handledData)) {
    //         // random
    //         const url = handledData.urls[Math.floor(Math.random() * handledData.urls.length)];

    //         randomPhotoData = {
    //             results: [
    //                 {
    //                     urls: { regular: url }
    //                 }
    //             ]
    //         }
    //     } else {

    //         const res = await fetch(RANDOM_PHOTO(randomWord));

    //         // get unsplash id from url
    //         const url = res.url;

    //         randomPhotoData = {
    //             results: [
    //                 {
    //                     urls: { regular: url }
    //                 }
    //             ]
    //         }

    //         // save to cms
    //         await fetch(UPDATE_UNSPLASH(randomWord), {
    //             method: 'PUT',
    //             body: JSON.stringify({ url }),
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })

    //     }
    // }

    return {
        props: {
            vip: matchedVip,
            // relatedVips: randomSixRelatedVips,
            // unsplashVip: {
            //     word: randomWord,
            //     photo: randomPhotoData
            // },
            params: ctx.params,
        },
        revalidate: 60
    }
}

export default PublicWord;
