import Layout from "@layouts";
import Meta from "@meta";
import LandingPage from "@components/LandingPage";

export default function IndexPage() {
    return (
        <Layout landing>
            <Meta
                title="Welcome - VIP"
                description="Vip is a simple application that helps you memorize and store vocabulary, idioms or phrases quickly. Easy registration, secure and ease of use."
            />
            <LandingPage />
        </Layout>
    );
}
