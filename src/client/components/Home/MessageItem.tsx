import { Tag, Row, Col } from 'antd';
import { Message } from 'core';

export function MessageItem({ msg }: { msg: Message }) {
  const tagProps = msg.isSystem
    ? { color: 'yellow' }
    : msg.user?.isAdmin
    ? { color: 'red' }
    : undefined;

  return (
    <div style={{ marginBottom: 12 }}>
      <Row gutter={12} align="top">
        <Col span={4}>
          <Tag {...tagProps}>{msg.user?.name ?? 'System'}</Tag>
        </Col>
        <Col span={20}>
          <Paragraph>{msg.content}</Paragraph>
        </Col>
      </Row>
    </div>
  );
}

function Paragraph(props: { children: string }) {
  const lines = props.children.split(/\n/);

  return (
    <>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </>
  );
}
