import React from "react";

import { Grid, Typography, Container } from '@mui/material';
import { Fonts, Colors } from '@styles';

import Layout from "@layouts";
import Meta from '@meta';

const Profile = () => {
    return (
        <Layout>
            <Meta
                title='Not Found - VIP'
                description='Sorry but the page you are looking for does not exist.'
                image='https://res.cloudinary.com/katyperrycbt/image/upload/v1644987502/Purple_And_Pink_Illustration_Error_404_Facebook_Post_2_tqk9qh.png'
                url='https://vip.trantrongthuc.com/404'
                canonical='https://vip.trantrongthuc.com/404'
            />
            <Container maxWidth='lg'>
                <Grid container justifyContent='center' alignItems='center'>
                    <Grid mt={2} item xs={12} display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Typography color='white.main' align='center' variant='h1' sx={{ fontSize: Fonts.FS_28, fontWeight: Fonts.FW_400 }}>
                            Not Found
                        </Typography>
                    </Grid>
                    <Grid mt={2} item xs={12}>
                        <Typography color='profileSubText.main' align='center' variant='h3' sx={{ fontSize: Fonts.FS_16, fontWeight: Fonts.FW_400 }}>
                            Sorry but the page you are looking for does not exist.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default Profile;