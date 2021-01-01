import { Space, Tag } from 'antd';

export function MessageItem(props: { name?: string; content: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Space>
        <Tag>{props.name}</Tag>
        <span>{props.content}</span>
      </Space>
    </div>
  );
}
