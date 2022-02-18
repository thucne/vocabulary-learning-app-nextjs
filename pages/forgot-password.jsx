import Layout from '@layouts';
import Meta from '@meta';
import ForgotPassword from '@components/Auth/ForgotPassword';

export default function LoginPage() {
  return (
    <Layout login>
      <Meta
        title="Forgot Password - VIP"
        description='Process steps to reset your password.'
        url='/forgot-password'
        canonical='/forgot-password'
      />
      <ForgotPassword />
    </Layout>
  )
}
