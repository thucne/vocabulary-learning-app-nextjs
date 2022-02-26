import React, { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Container, Grid, Typography, Link as MuiLink } from "@mui/material";

import Hero from "./Hero";

const LandingPage = () => {
    return (
        <Container maxWidth={false} disableGutters>
            <Hero />
        </Container>
    );
};

export default LandingPage;
