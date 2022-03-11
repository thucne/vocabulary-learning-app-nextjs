import React from 'react';

import { useRouter } from 'next/router';

import Layout from "@layouts";
import Meta from "@meta";
import PublicWordComponent from "@components/Words/Public";
import { API } from '@config';
import { deepExtractObjectStrapi } from '@utils';

const PublicWord = ({ vip, relatedVips, params }) => {
    return (
        <Layout noMeta tabName={vip?.vip}>
            <MetaTag vip={vip} params={params} />
            <PublicWordComponent vip={vip} params={params} relatedVips={relatedVips} />
        </Layout>
    );
};


const MetaTag = ({ vip, params }) => {

    const illustration = vip?.illustration?.data?.attributes;
    const photo = illustration?.formats?.medium?.url || illustration?.formats?.large?.url || illustration?.url || illustration?.formats?.small?.url;
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

export async function getStaticPaths() {

    const res = await fetch(`${API}/api/vips`);
    const data = (await res.json()).data;

    const paths = !!data?.length ? data.map(item => ({ params: { id: [item.attributes.vip, item.id.toString()] } })) : [];

    return {
        paths,
        fallback: 'blocking',
    };
}

export async function getStaticProps(ctx) {

    const { id: [vip, id] } = ctx.params;

    const allVips = await fetch(`${API}/api/vips?populate=*`);
    const vips = (await allVips.json())?.data;

    const matchedVip = deepExtractObjectStrapi(!id ? vips.find(item => item.attributes.vip === vip) : vips.find(item => item.id.toString() === id), {
        minifyPhoto: ['illustration']
    });
    const relatedVips = vips.filter(item => !id ? item.attributes.vip !== vip : item.id.toString() !== id);

    const formattedRelatedVips = relatedVips
        .map(item => deepExtractObjectStrapi(item, {
            minify: true,
            minifyFields: ['tags', 'meanings', 'examples', 'audio', 'synonyms', 'antonyms', 'lastReview', 'lastReviewOK'],
            minifyPhoto: ['illustration']
        }));

    const randomTenRelatedVips = formattedRelatedVips.sort(() => 0.5 - Math.random()).slice(0, 10);

    return {
        props: {
            vip: matchedVip,
            relatedVips: randomTenRelatedVips,
            params: ctx.params,
        },
        revalidate: 60
    }
}

export default PublicWord;