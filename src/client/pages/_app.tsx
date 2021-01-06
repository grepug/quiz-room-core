import 'antd/dist/antd.min.css';
import 'framework7/framework7-bundle.min.css';
import Framework7React from 'framework7-react';
import Framework7 from 'framework7/lite-bundle';
import 'framework7-icons';

Framework7.use(Framework7React);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
