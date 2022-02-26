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
                title="Not Found - VIP"
                description="Sorry but the page you are looking for does not exist. It might have been removed, renamed, or did not exist in the first place."
                image="https://res.cloudinary.com/katyperrycbt/image/upload/v1644987502/Purple_And_Pink_Illustration_Error_404_Facebook_Post_2_tqk9qh.png"
                url="/404"
                canonical="/404"
            />
            <Container maxWidth="lg">
                <Grid container justifyContent="center" alignItems="center">
                    <Grid mt={2} item xs={12}>
                        <ErrorPage
                            title="Not Found | VIP"
                            errorMessage="Page Not Found"
                            message="Sorry but the page you are looking for does not exist. It might have been removed, renamed, or did not exist in the first place."
                            illustration="https://res.cloudinary.com/katyperrycbt/image/upload/v1645006251/jungle-page-not-found-1_jzsgdk.png"
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
