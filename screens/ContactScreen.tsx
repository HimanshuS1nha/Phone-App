import {
  View,
  Text,
  StatusBar,
  Pressable,
  ImageBackground,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import tw from 'twrnc';
import SafeView from '../components/SafeView';
import {Contact} from 'react-native-contacts';
import {
  PhoneIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
} from 'react-native-heroicons/solid';
// @ts-ignore
import CallLogs from 'react-native-call-log';
import {CallLogType, RootStackParamsList} from '../types';
import {useFavourites} from '../hooks/useFavourites';
import ContactHeader from '../components/ContactHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContacts} from '../hooks/useContacts';
import DropdownMenu from '../components/DropdownMenu';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallLogs} from '../hooks/useCallLogs';

const ContactScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList, 'Contact'>>();
  const route = useRoute();
  const {setFavourites, favourites, getFavourites} = useFavourites();
  const {deleteContact, getContacts} = useContacts();
  const {getCallLogs: getCallLogsFromMemory} = useCallLogs();

  const contact: Contact & {color: string} = route.params as never;
  contact.phoneNumbers =
    contact.phoneNumbers?.length > 1
      ? contact.phoneNumbers.filter((item, i, self) => {
          return (
            i ===
            self.findIndex(i => {
              return (
                i.number.replaceAll(' ', '') === item.number.replaceAll(' ', '')
              );
            })
          );
        })
      : contact.phoneNumbers;

  const [callLogs, setCallLogs] = useState<CallLogType[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const handleChangeFavourites = useCallback(
    async (contact: Contact, type: 'add' | 'delete') => {
      if (type === 'add') {
        const newFavourites = [...favourites, contact];
        await AsyncStorage.setItem('favourites', JSON.stringify(newFavourites));
        setFavourites(newFavourites);
      } else {
        const newFavourites = favourites.filter(
          item => item.recordID !== contact.recordID,
        );
        await AsyncStorage.setItem('favourites', JSON.stringify(newFavourites));
        setFavourites(newFavourites);
      }
      getFavourites();
    },
    [contact],
  );

  const getCallLogs = useCallback(() => {
    if (contact.phoneNumbers.length === 0) {
      return;
    }
    CallLogs.load(3, {
      phoneNumbers: contact.phoneNumbers.map(phoneNumber =>
        phoneNumber.number
          .replaceAll(' ', '')
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('-', '')
          .replaceAll('+91', ''),
      ),
    }).then((res: CallLogType[]) => {
      setCallLogs(res);
    });
  }, [contact]);

  const parseDuration = useCallback((type: string, duration: number) => {
    let result = '';
    if (type === 'INCOMING') {
      result += 'Answered ';
    } else if (type === 'OUTGOING') {
      result += 'Outgoing ';
    } else {
      result += 'Missed';
      return result;
    }

    if (duration < 60) {
      result += `${duration} sec`;
    } else {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      if (minutes < 60) {
        result += `${minutes} min, ${seconds} sec`;
      } else {
        const hours = Math.floor(minutes / 60);
        result += `${hours} hrs, ${minutes} min, ${seconds} sec`;
      }
    }
    return result;
  }, []);

  useEffect(() => {
    getCallLogs();
  }, []);
  return (
    <>
      <SafeView>
        <DropdownMenu
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          options={[
            {
              title: 'Delete contact',
              action: () => {
                Alert.alert('Warning', 'Do you want to delete this contact', [
                  {
                    text: 'No',
                  },
                  {
                    text: 'Yes',
                    onPress: () => {
                      deleteContact(contact).then(res => {
                        if (res) {
                          getContacts();
                          getCallLogs();
                          navigation.goBack();
                        } else {
                          Alert.alert('Error', 'Some error occured.');
                        }
                      });
                    },
                  },
                ]);
              },
            },
          ]}
        />
        {contact.thumbnailPath ? (
          <View style={tw`h-[45%]`}>
            <ImageBackground
              source={{uri: contact.thumbnailPath}}
              style={tw`h-full`}
              resizeMode="stretch">
              <ContactHeader
                contact={contact}
                handleChangeFavourites={handleChangeFavourites}
                setIsVisible={setIsVisible}
              />
              <View style={tw`absolute bottom-[8%] w-full items-center`}>
                <Text style={tw`text-white text-3xl font-bold text-center`}>
                  {contact.displayName}
                </Text>
              </View>
            </ImageBackground>
          </View>
        ) : (
          <View style={tw`h-[45%] bg-${contact.color}-600`}>
            <ContactHeader
              contact={contact}
              handleChangeFavourites={handleChangeFavourites}
              setIsVisible={setIsVisible}
            />
            <View style={tw`absolute bottom-[8%] w-full items-center`}>
              <Text style={tw`text-white text-3xl font-bold`}>
                {contact.displayName}
              </Text>
            </View>
          </View>
        )}

        <View
          style={tw`bg-white pt-10 px-7 gap-y-8 border-b border-b-gray-200`}>
          {contact.phoneNumbers.length === 0 ? (
            <Text style={tw`text-rose-600 text-base text-center font-medium`}>
              No phone number added
            </Text>
          ) : (
            <View style={tw`gap-y-8`}>
              {contact?.phoneNumbers?.map((phoneNumber, i) => {
                return (
                  <View
                    key={i}
                    style={tw`flex-row justify-between items-center`}>
                    <View style={tw`flex-row items-center gap-x-5`}>
                      <Pressable>
                        <PhoneIcon color={'green'} size={26} />
                      </Pressable>
                      <View>
                        <Text style={tw`text-black font-semibold text-base`}>
                          {phoneNumber.number}
                        </Text>
                        <Text style={tw`capitalize`}>{phoneNumber.label}</Text>
                      </View>
                    </View>
                    <View style={tw`flex-row gap-x-5 items-center`}>
                      <Pressable>
                        <VideoCameraIcon color={'green'} size={26} />
                      </Pressable>
                      <Pressable>
                        <ChatBubbleLeftRightIcon color={'blue'} size={26} />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={tw``}></View>
        </View>

        <View style={tw`gap-y-6 px-5 pt-5`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text>Call Logs</Text>
            <Pressable
              onPress={() =>
                navigation.navigate('CallLogs', {
                  name: contact.displayName,
                  phoneNumbers: contact.phoneNumbers,
                })
              }>
              <ChevronRightIcon color={'black'} size={18} />
            </Pressable>
          </View>
          {callLogs.length === 0 ? (
            <Text style={tw`text-rose-600 font-medium text-center text-base`}>
              No call logs to show
            </Text>
          ) : (
            <View style={tw`gap-y-4`}>
              {callLogs.map((callLog, i) => {
                return (
                  <View style={tw`flex-row justify-between`} key={i}>
                    <View>
                      <Text style={tw`text-black text-base`}>
                        {parseDuration(callLog.type, callLog.duration)}
                      </Text>
                      <Text>{callLog.phoneNumber}</Text>
                    </View>
                    <Text>
                      {callLog.dateTime.substring(
                        0,
                        callLog.dateTime.length - 6,
                      )}{' '}
                      {callLog.dateTime.substring(
                        callLog.dateTime.length - 2,
                        callLog.dateTime.length,
                      )}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </SafeView>
      <StatusBar barStyle={'light-content'} backgroundColor={'#000'} />
    </>
  );
};

export default ContactScreen;
