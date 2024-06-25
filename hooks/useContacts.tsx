import {create} from 'zustand';
import Contacts from 'react-native-contacts';
import {Alert, BackHandler, Linking, PermissionsAndroid} from 'react-native';

type ContactsType = {
  contacts: Contacts.Contact[];
  getPermission: () => Promise<boolean[]>;
  requestPermission: (type: 'READ' | 'WRITE') => Promise<boolean | null>;
  getContacts: () => Promise<void>;
  addContact: () => Promise<boolean>;
  editContact: (
    contact: Contacts.Contact,
  ) => Promise<{result: boolean; name?: string}>;
  deleteContact: (contact: Contacts.Contact) => Promise<boolean>;
};

export const useContacts = create<ContactsType>(set => ({
  contacts: [],
  getPermission: async () => {
    const readStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    );
    const writeStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
    );

    return [readStatus, writeStatus];
  },
  requestPermission: async type => {
    if (type === 'READ') {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
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
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
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
    }
  },
  getContacts: async () => {
    Contacts.getAll().then(contacts => {
      contacts.sort((a, b) => (a.displayName > b.displayName ? 1 : -1));
      set({contacts});
    });
  },
  addContact: async () => {
    try {
      await Contacts.openContactForm({});
      return true;
    } catch (error) {
      return false;
    }
  },
  editContact: async contact => {
    try {
      const updatedContact = await Contacts.openExistingContact(contact);
      return {result: true, name: updatedContact.displayName};
    } catch (error) {
      return {result: false};
    }
  },
  deleteContact: async contact => {
    try {
      await Contacts.deleteContact(contact);
      return true;
    } catch (error) {
      return false;
    }
  },
}));
