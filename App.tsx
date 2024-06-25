import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import {StatusBar} from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ContactScreen from './screens/ContactScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CallInfoScreen from './screens/CallInfoScreen';
import CallLogsScreen from './screens/CallLogsScreen';
import SettingsScreen from './screens/SettingsScreen';
import {RootStackParamsList} from './types';

const Stack = createNativeStackNavigator<RootStackParamsList>();

const App = () => {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="CallInfo" component={CallInfoScreen} />
          <Stack.Screen name="CallLogs" component={CallLogsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
