import Layout from "@layouts";
import Meta from "@meta";
import Private from "@components/Auth/Private";
import Profile from "@components/Profile";

const ProfilePage = () => {
  
  return (
    <div>
      <Private MetaTag={MetaTag}>
        <Layout>
            <Profile/>
        </Layout>
      </Private>
    </div>
  );
};

const MetaTag = ({user}) => (
  <Meta
    title="User profile - Vip"
    description="Your dashboard. Includes all your words, analytics and more."
    image="https://res.cloudinary.com/katyperrycbt/image/upload/v1645008265/White_Blue_Modern_Minimalist_Manufacture_Production_Dashboard_Website_Desktop_Prototype_2_u9bt9p.png"
    url="/dashboard"
    canonical="/dashboard"
  />
);

export default ProfilePage;
