import { Space, Tag } from 'antd';
import { Message } from 'core';

export function MessageItem(props: { msg: Message }) {
  const tagProps = props.msg.user?.isAdmin ? { color: 'red' } : undefined;

  return (
    <div style={{ marginBottom: 12 }}>
      <Space>
        <Tag {...tagProps}>{props.msg.user?.name}</Tag>
        <span>{props.msg.content}</span>
      </Space>
    </div>
  );
}
