import { Row, Col, Input, Modal, Form } from 'antd';
import { Provider, useContext } from './Context';
import { MessageView } from 'components/Home/MessageView';
import { MockUserInput } from 'components/Home/MockUserInput';
import { Role } from 'quiz-room-core';

export function WSTestContainer() {
  return (
    <Provider>
      <WSTest />
    </Provider>
  );
}

function WSTest() {
  const ctx = useContext()!;

  function handleJoin(name: string) {
    const role = name === 'kai' ? Role.admin : Role.user;
    ctx.join(name, role);
  }

  if (!ctx.user) {
    return (
      <Modal visible title="Login">
        <Form.Item label="User Name">
          <Input
            onPressEnter={(e) =>
              // @ts-ignore
              handleJoin(e.target.value)
            }
          />
        </Form.Item>
      </Modal>
    );
  }

  return (
    <Row gutter={12}>
      <Col span={18}>
        <MessageView messages={ctx.messages} />
      </Col>
      <Col span={6}>
        <MockUserInput user={ctx.user} onSendMessage={ctx.sendMessage} />
      </Col>
    </Row>
  );
}
