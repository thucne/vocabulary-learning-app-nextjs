import React, { useState } from 'react';

import { withRouter } from 'next/router';

import Layout from "@layouts";
import Meta from "@meta";
import PublicWordComponent from "@components/Words/Public";
import { API } from '@config';
import { deepExtractObjectStrapi, sortRelatedVips, getJWT } from '@utils';
import Private from '@components/Auth/Private';
import { fetcherJWT } from '@actions';
import { Props, Fonts, Colors } from '@styles';
import { NO_PHOTO } from '@consts';

import ErrorPage from "@components/Error";
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
            pageSize: 100
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
                        title="Word Not Found | VIP"
                        errorMessage="Word Not Found"
                        message="The word you are looking for does not exist."
                        illustration={NO_PHOTO}
                        redirectTo={{
                            title: "Go to Homepage",
                            link: "/",
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
                <PublicWordComponent vip={matchedVip} params={router?.query} relatedVips={randomSixRelatedVips} />
            </Layout>
        </Private>
    );
};

const LoadingOrNotFound = () => (
    <Container maxWidth="md">
        <Grid container {...Props.GCRSC}>
            <Grid item xs={12} mt={2}>
                <Typography variant="caption">
                    <Skeleton width="50%" />
                </Typography>
                <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12}>

                {/* main word */}
                <Typography variant="h4" component="h1" className='overflowTypography'
                    sx={{
                        color: theme => theme.palette.publicWord3.main,
                    }}
                >
                    <Skeleton width="20%" />
                </Typography>

                {/* type2 */}
                <Grid container {...Props.GCRSC} spacing={0.5} mt={1}>
                    <Typography sx={{
                        fontWeight: Fonts.FW_500,
                        fontSize: Fonts.FS_14,
                        px: 0.5,
                        mr: 1,
                        borderRadius: '0.25rem',
                    }}>
                        <Skeleton width={30} />
                    </Typography>
                </Grid>

                {/* audio */}
                <Grid container {...Props.GCRSC}>
                    <Grid item xs={12} {...Props.GIRSC} mt={1} sx={{
                        position: 'relative',
                        color: (theme) => theme.palette.mainPublicWord.main
                    }}>

                        <Typography variant="body2" sx={{ letterSpacing: '-0.5px' }}>
                            <Skeleton width={50} />
                        </Typography>

                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }}>
                </Divider>

            </Grid>

            <Grid item xs={12}>
                <Skeleton height={100} />
            </Grid>

        </Grid>
    </Container >
)

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