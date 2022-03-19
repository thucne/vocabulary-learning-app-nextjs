import React from 'react';

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

const PublicWord = ({ vip, relatedVips, unsplashVip, params }) => {
    const router = useRouter();

    if (router.isFallback || _.isEmpty(vip)) {
        return (
            <Layout tabName={"Private word"}>
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
        )
    }

    return (
        <Layout noMeta tabName={vip?.vip}>
            <MetaTag vip={vip} params={params} />
            <PublicWordComponent vip={vip} params={params} relatedVips={relatedVips} unsplashVip={unsplashVip} />
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

    const randomSixRelatedVips = _.isObject(matchedVip) && !_.isEmpty(matchedVip) && await getNRelatedVips(matchedVip, 6);

    const randomWord = words[Math.floor(Math.random() * words.length)];

    const randomPhoto = await fetch(RANDOM_QUERY(randomWord));
    let randomPhotoData = await randomPhoto?.json().catch(err => console.log(err)) || {};

    if (_.isEmpty(randomPhotoData?.results)) {

        const localRes = await fetch(GET_LOCAL_UNSPLASH(randomWord));
        const localData = await localRes.json().catch(() => ({}));

        const handledData = deepExtractObjectStrapi(localData)?.[0];

        if (!_.isEmpty(handledData)) {
            // random
            const url = handledData.urls[Math.floor(Math.random() * handledData.urls.length)];

            randomPhotoData = {
                results: [
                    {
                        urls: { regular: url }
                    }
                ]
            }
        } else {

            const res = await fetch(RANDOM_PHOTO(randomWord));

            // get unsplash id from url
            const url = res.url;

            randomPhotoData = {
                results: [
                    {
                        urls: { regular: url }
                    }
                ]
            }

            // save to cms
            await fetch(UPDATE_UNSPLASH(randomWord), {
                method: 'PUT',
                body: JSON.stringify({ url }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        }
    }

    return {
        props: {
            vip: matchedVip,
            relatedVips: randomSixRelatedVips,
            unsplashVip: {
                word: randomWord,
                photo: randomPhotoData
            },
            params: ctx.params,
        },
        revalidate: 60
    }
}

export default PublicWord;
