import {View, Text, Pressable, Image} from 'react-native';
import React, {memo, useMemo} from 'react';
import {Contact} from 'react-native-contacts';
import tw from 'twrnc';
import {colors} from '../constants/colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../types';

const ContactPreview = ({contact}: {contact: Contact}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const color = useMemo(
    () => colors[Math.floor(Math.random() * colors.length)],
    [],
  );
  return (
    <Pressable
      style={tw`flex-row px-5 gap-x-5 items-center mb-10`}
      onPress={() => navigation.navigate('Contact', {...contact, color})}>
      {contact.thumbnailPath ? (
        <Image
          source={{uri: contact.thumbnailPath}}
          style={tw`w-12 h-12 rounded-full`}
          resizeMode="stretch"
        />
      ) : (
        <View
          style={tw`items-center justify-center w-12 h-12 bg-${color}-600 rounded-full`}>
          <Text style={tw`text-white text-lg font-semibold`}>
            {contact.givenName[0]}
          </Text>
        </View>
      )}
      <Text style={tw`text-black text-xl`}>{contact.displayName}</Text>
    </Pressable>
  );
};

export default memo(ContactPreview);
