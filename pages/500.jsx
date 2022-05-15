import React from "react";

import { Grid, Typography, Container } from "@mui/material";
import { Fonts, Colors } from "@styles";

import Layout from "@layouts";
import Meta from "@meta";
import ErrorPage from "@components/Error";

const Profile = () => {
    return (
        <Layout>
            <Meta
                title="Internal Server Error - VIP"
                description="Unexpected Error Occured."
                image="https://res.cloudinary.com/katyperrycbt/image/upload/v1652635916/cookie-the-pom-gySMaocSdqs-unsplash_w4qqzr.jpg"
                url="/500"
                canonical="/500"
            />
            <Container maxWidth="lg">
                <Grid container justifyContent="center" alignItems="center">
                    <Grid mt={2} item xs={12}>
                        <ErrorPage
                            title="Internal Server Error - VIP"
                            description="Unexpected Error Occured."
                            message="Please try again later... Sorry!"
                            illustration="https://res.cloudinary.com/katyperrycbt/image/upload/v1652635916/cookie-the-pom-gySMaocSdqs-unsplash_w4qqzr.jpg"
                            redirectTo={{
                                title: "Go to Homepage",
                                link: "/",
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default Profile;
