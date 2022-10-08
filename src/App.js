import { useState } from 'react';
import { API, Amplify } from 'aws-amplify';
import { withAuthenticator, Button, Heading, Flex } from '@aws-amplify/ui-react';
import logo from './logo.svg';
import awsExports from "./aws-exports";
import './App.css';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App({ user, signOut }) {
  const [data, setData] = useState([])

  async function getTelemonitoringData() {
    const response = await API.get('api76e270a8', '/telemonitoring/timestamp');
    console.log('response', response)
    setData(response)
  }

  return (
    <div className="App">
      <Flex direction={"column"} justifyContent="center" alignContent={"center"} className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>Hello {user.username}</Heading>
        {!data.length && <Button onClick={getTelemonitoringData}>Get Telemonitoring</Button>}
        {data.map((item, i) => <Heading level={2}>Index - {i}</Heading>)}
        <Button onClick={signOut}>Sign out</Button>
      </Flex>
    </div>
  );
}

export default withAuthenticator(App);
