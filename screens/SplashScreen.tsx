import {Image, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import SafeView from '../components/SafeView';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {useContacts} from '../hooks/useContacts';
import {useCallLogs} from '../hooks/useCallLogs';
import {useFavourites} from '../hooks/useFavourites';
import {RootStackParamsList} from '../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const SplashScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList, 'Splash'>>();

  const [isPermissionGiven, setIsPermissionGiven] = useState(false);
  const {
    getPermission: getContactsPermission,
    requestPermission: requestContactsPermission,
    getContacts,
    contacts,
  } = useContacts();
  const {
    getCallLogs,
    getPermission: getCallLogsPermission,
    requestPermission: requestCallLogsPermission,
    callLogs,
  } = useCallLogs();
  const {getFavourites} = useFavourites();

  useEffect(() => {
    getContactsPermission().then(async res => {
      if (!res[0]) {
        await requestContactsPermission('READ');
      }
      if (!res[1]) {
        await requestContactsPermission('WRITE');
      }
      getContacts();
      getCallLogsPermission().then(async res => {
        if (!res) {
          await requestCallLogsPermission();
        }
        getCallLogs();
        setIsPermissionGiven(true);
      });
    });

    getFavourites();
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPermissionGiven) {
      timeout = setTimeout(() => {
        navigation.replace('Home');
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [isPermissionGiven]);
  return (
    <SafeView style={tw`justify-center items-center`}>
      <Image
        source={require('../assets/logo.jpg')}
        style={tw`w-28 h-28 rounded-full`}
      />
    </SafeView>
  );
};

export default SplashScreen;
