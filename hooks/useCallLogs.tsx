import {create} from 'zustand';
import {Alert, BackHandler, Linking, PermissionsAndroid} from 'react-native';
// @ts-ignore
import CallLogs from 'react-native-call-log';
import {CallLogType} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CallLogsType = {
  callLogs: CallLogType[];
  getPermission: () => Promise<boolean>;
  requestPermission: () => Promise<boolean | null>;
  setCallLogs: (callLogs: []) => void;
  getCallLogs: () => Promise<void>;
};

export const useCallLogs = create<CallLogsType>(set => ({
  callLogs: [],
  getPermission: async () => {
    const status = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    );
    return status;
  },
  requestPermission: async () => {
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert('Error', 'The app needs this permission to work', [
        {
          text: 'Cancel',
          onPress: BackHandler.exitApp,
        },
        {
          text: 'Open settings',
          onPress: Linking.openSettings,
        },
      ]);
      return null;
    }
  },
  getCallLogs: async () => {
    const numberOfCallLogs = await AsyncStorage.getItem('number-of-call-logs');
    if (numberOfCallLogs) {
      CallLogs.load(parseInt(numberOfCallLogs)).then(
        (callLogs: CallLogType[]) => {
          set({callLogs});
        },
      );
    } else {
      CallLogs.load(50).then((callLogs: CallLogType[]) => {
        set({callLogs});
      });
    }
  },
  setCallLogs: callLogs => set({callLogs}),
}));
