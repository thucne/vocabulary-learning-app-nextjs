import DashboardPage from "@components/Dashboard";
import Layout from "@layouts";
import Meta from "@meta";

const Index = () => {
  return <Layout>
    <Meta
      title='Dashboard - VIP'
      description='Your dashboard. Includes all your words, analytics and more.'
      image='https://res.cloudinary.com/katyperrycbt/image/upload/v1645008265/White_Blue_Modern_Minimalist_Manufacture_Production_Dashboard_Website_Desktop_Prototype_2_u9bt9p.png'
      url='/dashboard'
      canonical='/dashboard'
    />
    <DashboardPage/>
  </Layout>;
};

export default Index;
