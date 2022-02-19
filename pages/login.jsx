import Layout from '@layouts';
import Meta from '@meta';
import Login from '@components/Auth/Login';

export default function LoginPage() {
    return (
        <Layout login>
            <Meta
                title="Log in - VIP"
                description='Login to view your words.'
                url='/login'
                canonical='/login'
            />
            <Login />
        </Layout>
    )
}
