import { Row, Col } from 'antd';
import { useContext } from './Context';
import { MockUserInput } from './MockUserInput';

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
