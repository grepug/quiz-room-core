// Import Framework7 Core

import { App, View } from 'framework7-react';
/*
Or import bundle with all components:
import Framework7 from 'framework7/lite-bundle';
*/

// Import Framework7 React
import QuizRoom from 'components/App/QuizRoom';

// Init plugin

export default function Index() {
  return (
    <App
      theme="ios"
      name="My App"
      id="com.demoapp.test"
      routes={[
        {
          path: '/',
          component: QuizRoom,
        },
      ]}
    >
      <View main url="/"></View>
    </App>
  );
}
