import {Pressable, Alert} from 'react-native';
import React, {useCallback, useState} from 'react';
import SafeView from '../components/SafeView';
import tw from 'twrnc';
import {useContacts} from '../hooks/useContacts';
import ContactPreview from '../components/ContactPreview';
import Header from '../components/Header';
import {PlusIcon} from 'react-native-heroicons/solid';
import {FlashList} from '@shopify/flash-list';
import DropdownMenu from '../components/DropdownMenu';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../types';

const ContactsScreen = () => {
  const {contacts, addContact, getContacts} = useContacts();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList, 'Contacts'>>();

  const [isVisible, setIsVisible] = useState(false);

  const handleAddContact = useCallback(() => {
    addContact().then(res => {
      if (res) {
        getContacts();
      } else {
        Alert.alert('Error', 'Some error occured.');
      }
    });
  }, []);
  return (
    <SafeView>
      <Header title="Contacts" setIsVisible={setIsVisible} />

      <DropdownMenu
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={[
          {title: 'Settings', action: () => navigation.navigate('Settings')},
        ]}
      />
      <FlashList
        data={contacts}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({item}) => {
          return <ContactPreview contact={item} />;
        }}
        estimatedItemSize={75}
      />
      <Pressable
        style={tw`absolute bg-green-500 p-3 rounded-xl bottom-3 right-3 shadow-xl shadow-black`}
        onPress={handleAddContact}>
        <PlusIcon color={'white'} size={30} />
      </Pressable>
    </SafeView>
  );
};

export default ContactsScreen;
