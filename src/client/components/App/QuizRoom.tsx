import {
  Page,
  Navbar,
  Link,
  Message,
  Messagebar,
  Messages,
} from 'framework7-react';
import { useEffect, useRef, useState } from 'react';
import { useContext, Provider } from './Context';

export default function () {
  return (
    <Provider>
      <MyPage />
    </Provider>
  );
}

function MyPage() {
  const ctx = useContext()!;
  const [inputValue, setInputValue] = useState('');
  const inputValueRef = useRef('');

  function sendMessage() {
    const value = inputValueRef.current.trim();

    if (value) {
      ctx.sendMessage(value);

      setInputValue('');
    }
  }

  useEffect(() => {
    const el = document.querySelector<HTMLTextAreaElement>(
      '#message-bar textarea'
    );

    if (el) {
      // el.type
      el.onkeypress = (e) => {
        if (e.key === 'Enter') {
          sendMessage();
          e.preventDefault();
        }
      };

      return () => {
        el.onkeypress = null;
      };
    }
  }, []);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  return (
    <Page>
      <Navbar title="Quiz Room" />
      <Messagebar
        placeholder="Your Answer"
        value={inputValue}
        sheetVisible={false}
        onInput={(e) => setInputValue(e.target.value)}
        id="message-bar"
      >
        <Link slot="inner-end" onClick={sendMessage}>
          Send
        </Link>
      </Messagebar>
      <Messages>
        <MessageList />
      </Messages>
    </Page>
  );
}

function MessageList() {
  const ctx = useContext()!;

  if (!ctx.user) {
    return null;
  }

  console.log('messages', ctx.messages);

  return (
    <>
      {ctx.messages.map((el) => {
        const p = el.getRenderProps(ctx.user!) as any;

        return <Message key={el.id} {...p}></Message>;
      })}
    </>
  );
}
