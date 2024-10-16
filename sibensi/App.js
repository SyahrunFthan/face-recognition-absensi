import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/Routers';
import {ModalProvider} from 'react-native-modal-message';

const App = () => {
  return (
    <ModalProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </ModalProvider>
  );
};

export default App;
