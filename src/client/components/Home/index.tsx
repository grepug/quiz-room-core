import { Typography, Divider, Button, Input, Row, Col } from 'antd';
import { Provider } from './Context';
import { MessageView } from './MessageView';

export function Home() {
  return (
    <Provider>
      <Typography.Title level={1}>Client Test</Typography.Title>
      <Divider />
      <Row>
        <Col span={6}>
          <MessageView />
        </Col>
        <Col span={18}></Col>
      </Row>
    </Provider>
  );
}

export function MockUserInput() {}
