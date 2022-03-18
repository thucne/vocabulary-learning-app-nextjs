import {
    Container, Grid, Typography, Skeleton, Divider,
} from '@mui/material';

import { Props, Fonts, Colors } from '@styles';

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
                <Typography variant="h4" component="h1">
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
                    <Grid item xs={12} {...Props.GIRSC} mt={1}>

                        <Typography variant="body2">
                            <Skeleton width={50} />
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }}>
                </Divider>

            </Grid>

            <Grid item xs={12}>
                <Skeleton height={100} />
                <Typography variant="p">
                    <Skeleton />
                </Typography>
            </Grid>

        </Grid>
    </Container >
)

export default LoadingOrNotFound;