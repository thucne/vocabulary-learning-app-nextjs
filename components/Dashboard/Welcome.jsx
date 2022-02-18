import { Container, Grid } from "@mui/material";
import React from "react";

/**
 * @author
 * @function
 **/

export default function Welcome(props) {
  return (
    <div>
      <Container maxWidth="lg">
        <Grid container direction="row">
          <Grid item xs={12} sm={6}>Left</Grid>
          <Grid item xs={12} sm={6}>Right</Grid>
        </Grid>
      </Container>
    </div>
  );
}
