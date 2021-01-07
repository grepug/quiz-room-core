import { Page, Navbar, Link, Messagebar, Messages } from 'framework7-react';
import { useEffect, useRef, useState } from 'react';
import { useContext, Provider } from './Context';
import { f7 } from 'framework7-react';
import { MessageList } from './MessageList';

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

  const lastSendTime = useRef(0);

  function sendMessage() {
    if (!ctx.user) return;
    if (Date.now() - lastSendTime.current < 2000) {
      f7.toast
        .create({
          text: 'too fast!',
          position: 'center',
          closeTimeout: 2000,
        })
        .open();

      return;
    }

    const value = inputValueRef.current.trim();

    if (value) {
      ctx.sendMessage(value);
      lastSendTime.current = Date.now();

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
  }, [ctx.user]);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  return (
    <Page>
      <Navbar title={`Quiz Room (${ctx.users.length} online)`} />
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
