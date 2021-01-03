import { Layout } from 'antd';
import { ReactNode } from 'react';

export function TestLayout(props: { children: ReactNode }) {
  return (
    <Layout>
      <Layout.Content style={{ padding: '50px' }}>
        {props.children}
      </Layout.Content>
    </Layout>
  );
}
