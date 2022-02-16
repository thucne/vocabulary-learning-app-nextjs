import Layout from '@layouts';
import Meta from '@meta';
import Signup from '@components/Auth/Signup';

export default function SignupPage() {
  return (
    <Layout login>
      <Meta
        title="Sign up - VIP"
        description='Getting started by creating new VIP account.'
        image='https://res.cloudinary.com/katyperrycbt/image/upload/v1644992547/LEARNING_WHILE_ifxgvn.png'
        url='/signup'
        canonical='/singup'
      />
      <Signup />
    </Layout>
  )
}
