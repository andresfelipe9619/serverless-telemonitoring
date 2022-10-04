import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import logo from './logo.svg';
import './App.css';
import '@aws-amplify/ui-react/styles.css';

function App({ user, signOut }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>Hello {user.username}</Heading>
        <Button onClick={signOut}>Sign out</Button>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
