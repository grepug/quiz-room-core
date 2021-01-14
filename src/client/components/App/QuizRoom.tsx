import { Page, Navbar, Link, Messagebar, Messages } from 'framework7-react';
import { useEffect, useRef, useState } from 'react';
import { useContext, Provider } from './Context';
import { MessageList } from './MessageList';
import { toast } from './toast';

export default function () {
  return (
    <Provider>
      <MyPage />
    </Provider>
  );
}

const textArea = () =>
  document.querySelector<HTMLTextAreaElement>('.messagebar-area textarea')!;

function MyPage() {
  const ctx = useContext()!;

  const lastSendTime = useRef(0);

  function sendMessage() {
    if (!ctx.user) return;
    if (Date.now() - lastSendTime.current < 2000) {
      toast('too fast!');

      return;
    }

    const value = textArea().value;

    if (value) {
      ctx.sendMessage(value);
      lastSendTime.current = Date.now();

      textArea().value = '';
    }
  }

  useEffect(() => {
    const el = textArea();

    if (el) {
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

  return (
    <Page>
      <Navbar title={`Quiz Room (${ctx.users.length} online)`} />
      <Messagebar
        placeholder="Your Answer"
        sheetVisible={false}
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
