import {View, Text, Pressable, Alert} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import tw from 'twrnc';
import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  StarIcon as FilledStarIcon,
} from 'react-native-heroicons/solid';
import {StarIcon as EmptyStarIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import {Contact} from 'react-native-contacts';
import {useContacts} from '../hooks/useContacts';
import {useFavourites} from '../hooks/useFavourites';
import {useCallLogs} from '../hooks/useCallLogs';

const ContactHeader = ({
  contact,
  handleChangeFavourites,
  setIsVisible,
}: {
  contact: Contact & {color: string};
  handleChangeFavourites: (
    contact: Contact,
    type: 'add' | 'delete',
  ) => Promise<void>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigation = useNavigation();
  const {editContact, getContacts} = useContacts();
  const {favourites} = useFavourites();
  const {getCallLogs} = useCallLogs();

  const [isFavourite, setIsFavourite] = useState(false);

  const changeFavourite = useCallback(() => {
    if (isFavourite) {
      setIsFavourite(false);
      handleChangeFavourites(contact, 'delete');
    } else {
      setIsFavourite(true);
      handleChangeFavourites(contact, 'add');
    }
  }, [isFavourite, contact]);

  const checkFavourites = useCallback(() => {
    favourites.map(item => {
      if (item.recordID === contact.recordID) {
        setIsFavourite(true);
      }
    });
  }, [contact, favourites]);

  const handleEditContact = useCallback(() => {
    const {color, ...restContact} = contact;
    editContact(restContact).then(res => {
      if (res.result) {
        contact.displayName = res.name as string;
        getContacts();
        getCallLogs();
      } else {
        Alert.alert('Error', 'Some error occured.');
      }
    });
  }, [contact]);

  useEffect(() => {
    checkFavourites();
  }, []);
  return (
    <View style={tw`pt-4 px-3 flex-row items-center justify-between`}>
      <Pressable onPress={navigation.goBack}>
        <ChevronLeftIcon color={'white'} size={24} />
      </Pressable>
      <View style={tw`flex-row gap-x-7 items-center`}>
        <Pressable onPress={handleEditContact}>
          <PencilIcon color={'white'} size={24} />
        </Pressable>
        <Pressable onPress={changeFavourite}>
          {isFavourite ? (
            <FilledStarIcon color={'white'} size={24} />
          ) : (
            <EmptyStarIcon color={'white'} size={24} />
          )}
        </Pressable>
        <Pressable onPress={() => setIsVisible(prev => !prev)}>
          <EllipsisVerticalIcon color={'white'} size={24} />
        </Pressable>
      </View>
    </View>
  );
};

export default ContactHeader;
