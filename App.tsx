import React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { light as lightTheme, mapping } from '@eva-design/eva';
import TabNavigator from './src/navigation/StackNavigation';

const themes = {
  light: {
    ...lightTheme,
  },
};

const selectedTheme = 'light';

const App = () => {
  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...mapping[selectedTheme]}
        theme={themes[selectedTheme]}
      >
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </ApplicationProvider>
    </React.Fragment>
  );
};

export default App;
