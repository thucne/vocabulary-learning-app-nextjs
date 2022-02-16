import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

import {
    Grid, Typography, Link as MuiLink,
    Divider,
    IconButton
} from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';

import { Colors, Fonts } from '@styles';

const Footer = ({ bottom }) => {
    const [pos, setPos] = useState(0);
    const footerRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (bottom + (footerRef?.current?.clientHeight || 120) < window.innerHeight) {
            setPos(window.innerHeight - bottom - (footerRef?.current?.clientHeight || 120));
        }
    }, [router, footerRef, bottom]);

    return (
        <Grid ref={footerRef} container
            className='noselect'
            sx={{
                width: '100%',
                minHeight: 300,
                position: 'relative',
                top: pos,
                paddingTop: theme => theme.spacing(1.5),
                paddingBottom: theme => theme.spacing(1.5),
                py: [1, 2, 3],
                px: [4, 5, 6]
            }}
            columns={{ xs: 12, sm: 14, md: 17 }}
        >
            <Grid item xs={12} sm={6} md={4} mb={[1, 2, 3, 4]}>
                <Grid container alignItems='center'>
                    <Grid item xs={5} md={12} sx={{ width: '100%', height: 200 }}>
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            <Image
                                src='/logo.full.svg'
                                alt='VIP'
                                layout='fill'
                                objectFit='contain'
                                priority={true}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={7} md={12} pr={[2, 2, 0]}>
                        <Typography variant='caption' sx={{ lineHeight: '50%' }} color='footer_title.main'>
                            <b>Vip</b> is a simple application that helps you memorize and store vocabulary,
                            idioms or phrases quickly. Easy registration, secure and ease of use.
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            {
                allLinks.map((item, index) => {
                    return <Grid item xs={6} sm={4} md={3} lg={2} key={`footer-cols-${index}`} mt={4}>
                        <EachColumn title={item.title} links={item.links} />
                    </Grid>
                })
            }
            <Grid item xs={12} sm={14} md={17} mt={5}>
                <Divider />
            </Grid>
            <Grid item xs={12} sm={14} md={17} mt={3} mb={5}>
                <Grid container direction={['row-reverse', 'row']}>
                    <Grid item xs={12} sm={7} md={8} display='flex' justifyContent='flex-start'>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography variant='body' color='footer_link.main'>
                                    @{new Date().getFullYear()}, Vip
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Link href="/terms-of-use" passHref>
                                    <MuiLink underline='none' color='footer_link.main'>Terms</MuiLink>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/privacy" passHref>
                                    <MuiLink underline='none' color='footer_link.main'>Privacy</MuiLink>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={7} md={9} display='flex' justifyContent={['flex-start', 'flex-end']}
                        sx={{
                            '*': {
                                filter: typeof window !== 'undefined' && (localStorage?.getItem("colorMode") || "light") === 'dark' ? 'contrast(0%) brightness(200%)' : 'contrast(50%) brightness(100%)'
                            },
                            '*:hover': {
                                filter: 'contrast(100%) brightness(100%)'
                            }
                        }}
                    >
                        <Grid container spacing={2} justifyContent={['flex-start', 'flex-end']}>
                            <Grid item>
                                <Typography variant='body' color='footer_link.main'>
                                    Join us on
                                </Typography>
                            </Grid>
                            <Grid item sx={{
                                ':hover': {
                                    filter: 'contrast(100%) brightness(100%)'
                                }
                            }}>
                                <Link href='https://github.com/katyperrycbt/vip-mui' passHref>
                                    <MuiLink color='black.main'>
                                        <GitHubIcon />
                                    </MuiLink>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

const EachColumn = ({ title = '', links = [] }) => {
    return <Grid container p={2}>
        <Grid item xs={12} mb={3}>
            <Typography variant="h6" color='footer_title.main'>
                {title.toUpperCase()}
            </Typography>
        </Grid>
        {
            links.map((item, index) => {
                return <Grid item xs={12} key={`footer-title-${index}`} mt={1}>
                    <Link href={item.href} passHref>
                        <MuiLink underline='none' color='footer_link.main'>{item.title}</MuiLink>
                    </Link>
                </Grid>
            })
        }
    </Grid>
}

const allLinks = [
    {
        title: 'Explore',
        links: [
            { title: 'Landing page', href: '/' },
            { title: 'My dashboard', href: '/dashboard' },
            { title: 'Login', href: '/login' },
            { title: 'Signup', href: '/signup' },
        ]
    },
    {
        title: 'Resources',
        links: [
            { title: 'Document', href: '/document' },
            { title: 'How to get started', href: '/how-to-get-started' },
        ]
    },
    {
        title: 'Integrations',
        links: [
            { title: 'Unsplash', href: 'https://unsplash.com/' },
            { title: 'Icons8', href: 'https://icons8.com/' },
        ]
    },
    {
        title: 'About us',
        links: [
            { title: 'About us', href: '/about-us' },
            { title: 'Contact us', href: '/contact-us' },
            { title: 'Blog', href: '/blog' },
        ]
    }
]

export default Footer;