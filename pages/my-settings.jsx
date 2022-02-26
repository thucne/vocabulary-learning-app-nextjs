import Layout from "@layouts";
import Meta from "@meta";
import Private from "@components/Auth/Private";
import MySettingsComponent from "@components/Private/Settings";


const MyWordList = () => {
    return (
        <Private MetaTag={MetaTag}>
            <Layout>
                <MySettingsComponent />
            </Layout>
        </Private>
    );
};

const MetaTag = () => <Meta
    title='My settings - VIP'
    description='Vip is a simple application that helps you memorize and store vocabulary, idioms or phrases quickly. Easy registration, secure and ease of use.'
    url='/my-settings'
    canonical='/my-settings'
/>

export default MyWordList;
