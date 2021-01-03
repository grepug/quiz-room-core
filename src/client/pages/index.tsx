// Import Framework7 Core
import Framework7 from 'framework7/lite';
import {
  App,
  View,
  Page,
  Navbar,
  Toolbar,
  Link,
  Message,
  Messagebar,
  Messages,
} from 'framework7-react';
/*
Or import bundle with all components:
import Framework7 from 'framework7/lite-bundle';
*/

// Import Framework7 React
import Framework7React from 'framework7-react';
import { useState } from 'react';

// Init plugin
Framework7.use(Framework7React);

export default function Index() {
  const [inputValue, setInputValue] = useState('');

  function sendMessage() {}

  return (
    <App theme="auto" name="My App" id="com.demoapp.test">
      {/* <View main> */}
      <Page>
        <Navbar title="Awesome App"></Navbar>
        <Messagebar
          placeholder="Your Answer"
          value={inputValue}
          sheetVisible={false}
          onInput={(e) => setInputValue(e.target.value)}
        >
          <Link
            iconIos="f7:camera_fill"
            iconAurora="f7:camera_fill"
            iconMd="material:camera_alt"
            slot="inner-start"
            onClick={() => {
              // setSheetVisible(!sheetVisible);
            }}
          />
          <Link
            iconIos="f7:arrow_up_circle_fill"
            iconAurora="f7:arrow_up_circle_fill"
            iconMd="material:send"
            slot="inner-end"
            onClick={sendMessage}
          />
        </Messagebar>
        {/* <Message></Message> */}
      </Page>
      {/* </View> */}
    </App>
  );
}
