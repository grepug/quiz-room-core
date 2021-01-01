import { Space, Tag } from 'antd';
import { Message } from 'core';

export function MessageItem({ msg }: { msg: Message }) {
  const tagProps = msg.isSystem
    ? { color: 'yellow' }
    : msg.user?.isAdmin
    ? { color: 'red' }
    : undefined;

  return (
    <div style={{ marginBottom: 12 }}>
      <Space>
        <Tag {...tagProps}>{msg.user?.name ?? 'System'}</Tag>
        <span>{msg.content}</span>
      </Space>
    </div>
  );
}
