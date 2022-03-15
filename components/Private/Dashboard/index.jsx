import React, { useEffect, useState } from "react";

import { Container, Divider } from "@mui/material";

import Hero from "./Hero";
import WordList from "./WordList";

export default function DashboardPage(props) {
    
    return (
        <Container maxWidth="lg">

            <Hero />
            <Divider sx={{ width: "100%", my: 2 }} />

            <WordList />
            <Divider sx={{ width: "100%", my: 2 }} />

        </Container>
    );
}
