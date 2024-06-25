import {
  View,
  Text,
  Image,
  Pressable,
  Linking,
  Alert,
  TouchableHighlight,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import SafeView from '../components/SafeView';
import Header from '../components/Header';
import tw from 'twrnc';
import {useCallLogs} from '../hooks/useCallLogs';
import CallLogPreview from '../components/CallLogPreview';
import {FlashList} from '@shopify/flash-list';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {
  Bars3Icon,
  BackspaceIcon,
  PhoneIcon,
} from 'react-native-heroicons/solid';
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {useContacts} from '../hooks/useContacts';
import {useNavigation} from '@react-navigation/native';
import DropdownMenu from '../components/DropdownMenu';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../types';

type FilteredContactsType = {
  displayName: string;
  number: string;
};

const DialScreen = () => {
  const {callLogs} = useCallLogs();
  const {contacts} = useContacts();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList, 'Dial'>>();
  const numbers = useMemo(
    () => [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      ['*', 0, '#'],
    ],
    [],
  );

  const [isVisible, setIsVisible] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<
    FilteredContactsType[]
  >([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const changeIsVisible = useCallback(() => {
    setIsVisible(prev => !prev);
  }, [isVisible]);

  const changePhoneNumber = useCallback(
    (value: string) => {
      setPhoneNumber(prev => (prev.length < 10 ? prev + value : prev));
    },
    [phoneNumber],
  );

  const clearPhoneNumber = useCallback(() => {
    setPhoneNumber(prev => prev.substring(0, prev.length - 1));
  }, [phoneNumber]);

  const openWhatsapp = useCallback(() => {
    if (phoneNumber.trim().length === 10) {
      try {
        setPhoneNumber('');
        Linking.openURL(`whatsapp://send?phone=91${phoneNumber}`);
      } catch (error) {
        Alert.alert('Error', 'Some error occured.');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid phone number');
    }
  }, [phoneNumber]);

  const makeCall = useCallback(() => {
    if (phoneNumber.trim().length > 0) {
      setPhoneNumber('');
      RNImmediatePhoneCall.immediatePhoneCall(phoneNumber);
    } else {
      Alert.alert('Error', 'Please enter a valid phone number');
    }
  }, [phoneNumber]);

  const filterContacts = useCallback(() => {
    let newContacts: FilteredContactsType[] = [];
    contacts.map(contact => {
      contact.phoneNumbers.map(number => {
        if (
          number.number
            .replace('+91', '')
            .replaceAll('(', '')
            .replaceAll(')', '')
            .replaceAll(' ', '')
            .startsWith(phoneNumber)
        ) {
          newContacts.push({
            displayName: contact.displayName,
            number: number.number,
          });
        }
      });
    });
    setFilteredContacts(newContacts);
  }, [contacts, filteredContacts, phoneNumber]);

  useEffect(() => {
    if (phoneNumber) {
      filterContacts();
    }
  }, [phoneNumber]);
  return (
    <SafeView>
      <Header title="Dial" setIsVisible={setIsDropdownVisible} />

      <DropdownMenu
        isVisible={isDropdownVisible}
        setIsVisible={setIsDropdownVisible}
        options={[
          {
            title: 'Settings',
            action: () => {
              navigation.navigate('Settings');
            },
          },
        ]}
      />

      {phoneNumber ? (
        <View>
          <View style={tw`items-center`}>
            <Text style={tw`text-black text-2xl font-bold`}>{phoneNumber}</Text>
          </View>

          <View style={tw`pt-10 h-[170px]`}>
            <FlashList
              data={filteredContacts}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({item}) => {
                return (
                  <Pressable
                    style={tw`pl-16 pr-5 mb-8`}
                    onPress={() =>
                      RNImmediatePhoneCall.immediatePhoneCall(item.number)
                    }>
                    <Text style={tw`text-black text-lg`}>
                      {item.displayName}
                    </Text>
                    <Text>{item.number}</Text>
                  </Pressable>
                );
              }}
              estimatedItemSize={50}
            />
          </View>
        </View>
      ) : (
        <FlashList
          data={callLogs}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item}) => {
            return <CallLogPreview callLog={item} />;
          }}
          estimatedItemSize={50}
        />
      )}

      {!isVisible && (
        <View style={tw`absolute w-full bottom-[4%] items-center`}>
          <Pressable
            style={tw`p-4 rounded-full bg-green-500`}
            onPress={changeIsVisible}>
            <Bars3Icon color={'white'} size={30} />
          </Pressable>
        </View>
      )}

      {isVisible && (
        <BottomSheet
          snapPoints={['58%']}
          style={tw`bg-gray-100`}
          enablePanDownToClose
          animateOnMount
          onClose={changeIsVisible}>
          <BottomSheetView>
            <View style={tw`pt-6 items-center justify-center gap-y-8`}>
              {numbers.map((number, i) => {
                return (
                  <View key={i} style={tw`flex-row w-[66%] justify-between`}>
                    {number.map(item => {
                      return (
                        <Pressable
                          key={item}
                          onPress={() => changePhoneNumber(item.toString())}>
                          <Text style={tw`text-4xl text-black`}>{item}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                );
              })}
              <View style={tw`flex-row w-[65%] gap-x-20 items-center`}>
                <Pressable
                  onPress={clearPhoneNumber}
                  disabled={phoneNumber.length === 0}>
                  <BackspaceIcon color={'black'} size={30} />
                </Pressable>
                <TouchableHighlight
                  underlayColor={'#86efac'}
                  style={tw`bg-green-500 rounded-full p-3`}
                  onPress={makeCall}>
                  <PhoneIcon color={'white'} size={25} />
                </TouchableHighlight>
                <Pressable onPress={openWhatsapp}>
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/124/124034.png',
                    }}
                    style={tw`rounded-full rounded-full w-10 h-10`}
                  />
                </Pressable>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      )}
    </SafeView>
  );
};

export default DialScreen;
