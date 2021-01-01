import { Typography, Divider, Button, Input, Row, Col, Space } from 'antd';
import { User, Message, MessageType } from 'core';
import { Provider } from './Context';
import { MessageView } from './MessageView';
import { useContext } from './Context';
import { useState } from 'react';

export function Home() {
  return (
    <Provider>
      <Typography.Title level={1}>Client Test</Typography.Title>
      <Divider />
      <Row gutter={20}>
        <Col span={8}>
          <MessageView />
        </Col>
        <Col span={16}>
          <MockUserInputContainer />
        </Col>
      </Row>
    </Provider>
  );
}

export function MockUserInputContainer() {
  const ctx = useContext()!;

  return (
    <Row gutter={[24, 24]}>
      {ctx.users.map((el) => (
        <Col span={12} key={el.id}>
          <MockUserInput user={el} onSendMessage={ctx.sendUserMessage} />
        </Col>
      ))}
    </Row>
  );
}

export function MockUserInput(props: {
  user: User;
  onSendMessage: (msg: Message) => void;
}) {
  const [value, setValue] = useState<string>();

  return (
    <Space>
      <span>{props.user.name}</span>
      <Input
        style={{ width: 300 }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={() => {
          value &&
            props.onSendMessage(
              new Message({
                user: props.user,
                content: value,
                type: MessageType.default,
              })
            );

          setValue('');
        }}
      />
    </Space>
  );
}
