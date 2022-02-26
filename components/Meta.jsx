import Head from "next/head";
import { FB, DOMAIN } from "@config";

const Meta = ({
    title = "Dashboard - VIP",
    description = "A better way to practice your vocabulary, idioms and phrases.",
    image = "https://res.cloudinary.com/katyperrycbt/image/upload/v1645021650/Untitled_design_2_1_tvtyob.png",
    url = ``,
    canonical = ``,
    publishedTime = undefined,
    modifiedTime = undefined,
    type = "website",
    author = undefined,
    section = undefined,
    tag = undefined,
    publisher = undefined,
    robots = "index, follow",
}) => {
    return (
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" type="image/png" href="/logo.icon.192.png" />
            <link
                rel="apple-touch-icon-precomposed"
                type="image/png"
                href="/logo.icon.192.png"
            />
            <link
                rel="icon"
                type="image/png"
                href="/logo.icon.16.png"
                sizes="16x16"
            />
            <link
                rel="icon"
                type="image/png"
                href="/logo.icon.32.png"
                sizes="32x32"
            />
            <link
                rel="icon"
                type="image/png"
                href="/logo.icon.96.png"
                sizes="96x96"
            />
            <link
                rel="icon"
                type="image/png"
                href="/logo.icon.144.png"
                sizes="144x144"
            />
            <link
                rel="icon"
                type="image/png"
                href="/logo.icon.192.png"
                sizes="192x192"
            />
            <link
                rel="icon"
                type="image/png"
                href="/logo.icon.256.png"
                sizes="256x256"
            />
            <link
                rel="icon"
                type="image/png"
                href="/logo.icon.512.png"
                sizes="512x512"
            />
            <link rel="mask-icon" href="/logo.icon.svg" color="#0000FF" />
            <meta name="robots" content={robots} key="roboo" />
            <title key="maintitle">{title}</title>
            <meta name="title" content={title} key="titlemeta" />,
            <meta name="description" content={description} />
            <meta property="og:title" content={title} key="titlemeta_og" />
            <meta
                property="og:description"
                content={description}
                key="discriptionmeta_og"
            />
            <meta property="og:image" content={image} key="image_og" />
            <meta
                property="og:image:secure_url"
                content={image}
                key="image_secure_og"
            />
            <meta property="og:url" content={`${DOMAIN}${url}`} key="url_og" />
            <meta property="og:type" content={type} key="type_og" />
            <meta property="twitter:title" content={title} key="titlemeta_tt" />
            <meta
                property="twitter:description"
                content={description}
                key="discriptionmeta_tt"
            />
            <meta property="twitter:image" content={image} key="image_tt" />
            <meta
                property="twitter:url"
                content={`${DOMAIN}${url}`}
                key="url_twitter"
            />
            {publishedTime && (
                <meta
                    property="article:published_time"
                    content={publishedTime}
                    key="published_time"
                />
            )}
            {modifiedTime && (
                <meta
                    property="article:modified_time"
                    content={modifiedTime}
                    key="modified_time"
                />
            )}
            {author && (
                <meta property="article:author" content={author} key="author_meta" />
            )}
            {section && (
                <meta property="article:section" content={section} key="section_meta" />
            )}
            {tag && <meta property="article:tag" content={tag} key="tag_meta" />}
            {publisher && (
                <meta
                    property="article:publisher"
                    content={publisher}
                    key="publisher_meta"
                />
            )}
            <link rel="canonical" href={`${DOMAIN}${canonical}`} key="cano" />
            <meta property="fb:app_id" content={FB} key="appid" />
            <link rel="manifest" href="/manifest.json" />
        </Head>
    );
};

export default Meta;
