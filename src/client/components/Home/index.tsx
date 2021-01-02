import { Typography, Divider, Row, Col } from 'antd';
import { Provider, Consumer } from './Context';
import { MessageView } from './MessageView';
import { MockUserInputContainer } from './MockUserInputContainer';

export function Home() {
  return (
    <Provider>
      <Typography.Title level={1}>Client Test</Typography.Title>
      <Divider />
      <Row gutter={20}>
        <Col span={8}>
          <Consumer>
            {(ctx) => <MessageView messages={ctx!.messages} />}
          </Consumer>
        </Col>
        <Col span={16}>
          <MockUserInputContainer />
        </Col>
      </Row>
    </Provider>
  );
}
