import React from 'react';

import { withRouter } from 'next/router';

import Layout from "@layouts";
import Meta from "@meta";
import Private from "@components/Auth/Private";
import PublicWordComponent from "@components/Words/Public";
import { API } from '@config';

const PublicWord = () => {
    return (
        <Layout noMeta tabName={'Public word'}>
            <MetaTag />
            <PublicWordComponent />
        </Layout>
    );
};


const MetaTag = () => (
    <Meta
        title="Dashboard - VIP"
        description="Your dashboard. Includes all your words, analytics and more."
        image="https://res.cloudinary.com/katyperrycbt/image/upload/v1645008265/White_Blue_Modern_Minimalist_Manufacture_Production_Dashboard_Website_Desktop_Prototype_2_u9bt9p.png"
        url="/dashboard"
        canonical="/dashboard"
    />
);

export async function getStaticPaths() {

    const res = await fetch(`${API}/api/vips`);
    const data = await res.json();

    const paths = !!data.data.length ? data.data.map(item => ({ params: { id: [item.attributes.vip, item.id.toString()] } })) : [];

    return {
        paths,
        fallback: 'blocking',
    };
}

export async function getStaticProps(ctx) {

    return {
        props: {
            word: {
                id: '1',
                text: 'Hello world',
            }
        },
        revalidate: 60
    }
}

export default PublicWord;