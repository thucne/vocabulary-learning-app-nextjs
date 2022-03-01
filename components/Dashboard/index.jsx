import React, { useEffect, useState } from "react";

import { Container, Divider } from "@mui/material";

import { fetcherJWT } from "@actions";
import { API } from "@config";

import Hero from "./Hero";
import WordList from "./WordList";

const fetcher = async (...args) => await fetcherJWT(...args);

export default function DashboardPage(props) {
    const [openWordForm, setOpenWordForm] = useState(false);

    return (
        <Container maxWidth="lg">

            <Hero open={openWordForm} setOpen={setOpenWordForm}  />
            <Divider sx={{ width: "100%", my: 2 }} />

            <WordList open={openWordForm} setOpen={setOpenWordForm} />
            <Divider sx={{ width: "100%", my: 2 }} />

        </Container>
    );
}
