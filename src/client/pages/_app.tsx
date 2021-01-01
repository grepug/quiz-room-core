import 'antd/dist/antd.min.css';
import { Layout } from 'antd';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Layout.Content style={{ padding: '50px' }}>
        <Component {...pageProps} />
      </Layout.Content>
    </Layout>
  );
}

export default MyApp;
