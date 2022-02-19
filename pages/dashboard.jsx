import Layout from "@layouts";
import Meta from "@meta";
import Private from "@components/Auth/Private";
import DashboardPage from "@components/Dashboard";


const Index = () => {
    return (
        <Private MetaTag={MetaTag}>
            <Layout>
                <DashboardPage />
            </Layout>
        </Private>
    );
};

const MetaTag = () => <Meta
    title='Dashboard - VIP'
    description='Your dashboard. Includes all your words, analytics and more.'
    image='https://res.cloudinary.com/katyperrycbt/image/upload/v1645008265/White_Blue_Modern_Minimalist_Manufacture_Production_Dashboard_Website_Desktop_Prototype_2_u9bt9p.png'
    url='/dashboard'
    canonical='/dashboard'
/>

export default Index;
