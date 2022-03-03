import Layout from "@layouts";
import Meta from "@meta";
import Private from "@components/Auth/Private";
import Profile from "@components/Private/Account";

const ProfilePage = () => {

    return (
        <Private MetaTag={MetaTag}>
            <Layout noMeta tabName="Account">
                <Profile />
            </Layout>
        </Private>
    );
};

const MetaTag = ({ user }) => (
    <Meta
        title="Account - VIP"
        description="Change account information"
        image="https://res.cloudinary.com/katyperrycbt/image/upload/v1645008265/White_Blue_Modern_Minimalist_Manufacture_Production_Dashboard_Website_Desktop_Prototype_2_u9bt9p.png"
        url="/my-account"
        canonical="/my-account"
    />
);

export default ProfilePage;
