import Private from "@components/Auth/Private";
import Library from "@components/Library";
import Meta from "@components/Meta";
import Layout from "@layouts/";
import React from "react";

const MyLibrary = () => {
  return (
    <Private MetaTag={MetaTag}>
      <Layout noMeta tabName="Library" >
        <Library />
      </Layout>
    </Private>
  );
};


const MetaTag = ({ user }) => (
  <Meta
    title="My Library - VIP"
    description="Change account information"
    image="https://res.cloudinary.com/katyperrycbt/image/upload/v1645008265/White_Blue_Modern_Minimalist_Manufacture_Production_Dashboard_Website_Desktop_Prototype_2_u9bt9p.png"
    url="/my-account"
    canonical="/my-account"
  />
);

export default MyLibrary;
