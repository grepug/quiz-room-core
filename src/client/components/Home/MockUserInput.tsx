import { Input, Space } from 'antd';
import { User, Message, MessageType } from 'core';
import { useState } from 'react';

export function MockUserInput(props: {
  user: User;
  onSendMessage: (msg: Message) => void;
}) {
  const [value, setValue] = useState<string>();

  return (
    <Space>
      <span
        style={{
          color: props.user.isAdmin ? 'red' : '',
        }}
      >
        {props.user.name}
      </span>
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
