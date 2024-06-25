import {Contact, PhoneNumber} from 'react-native-contacts';

export type RootStackParamsList = {
  Splash: undefined;
  Home: undefined;
  Contact: Contact & {color: string};
  CallLogs: {
    name: string;
    phoneNumbers: PhoneNumber[];
  };
  CallInfo: {
    callLog: CallLogType;
  };
  Settings: undefined;
  Contacts: undefined;
  Dial: undefined;
  Favourites: undefined;
};

export type CallLogType = {
  dateTime: string;
  duration: number;
  name: string;
  phoneNumber: string;
  rawType: number;
  timeStamp: string;
  type: string;
};
