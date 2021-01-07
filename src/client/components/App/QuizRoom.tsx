import {
  Page,
  Navbar,
  Link,
  Message,
  Messagebar,
  Messages,
} from 'framework7-react';
import { useState } from 'react';
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

  function sendMessage() {
    const value = inputValue.trim();

    if (value) {
      ctx.sendMessage(inputValue);

      setInputValue('');
    }
  }

  return (
    <Page>
      <Navbar title="Quiz Room" />
      <Messagebar
        placeholder="Your Answer"
        value={inputValue}
        sheetVisible={false}
        onInput={(e) => setInputValue(e.target.value)}
      >
        <Link
          iconIos="f7:arrow_up_circle_fill"
          iconAurora="f7:arrow_up_circle_fill"
          iconMd="material:send"
          slot="inner-end"
          onClick={sendMessage}
        />
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
