import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DialScreen from './DialScreen';
import {PhoneIcon, UserGroupIcon, StarIcon} from 'react-native-heroicons/solid';
import ContactsScreen from './ContactsScreen';
import FavouritesScreen from './FavouritesScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName="Dial">
      <Tab.Screen
        name="Dial"
        component={DialScreen}
        options={{
          tabBarIcon: ({color, size}) => {
            return <PhoneIcon size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({color, size}) => {
            return <UserGroupIcon size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          tabBarIcon: ({color, size}) => {
            return <StarIcon size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;
