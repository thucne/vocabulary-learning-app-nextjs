import Layout from "@layouts";
import Meta from "@meta";
import Private from "@components/Auth/Private";
import WordList from "@components/Private/WordList";

const MyWordList = () => {
    return (
        <Private MetaTag={MetaTag}>
            <Layout noMeta tabName="Word List">
                <WordList />
            </Layout>
        </Private>
    );
};

const MetaTag = () => (
    <Meta
        title="My words - VIP"
        description="Vip is a simple application that helps you memorize and store vocabulary, idioms or phrases quickly. Easy registration, secure and ease of use."
        url="/my-word-list"
        canonical="/my-word-list"
    />
);

export default MyWordList;
