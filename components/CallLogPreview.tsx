import {View, Text, Pressable} from 'react-native';
import React, {memo, useCallback} from 'react';
import tw from 'twrnc';
import {
  PhoneArrowUpRightIcon,
  PhoneArrowDownLeftIcon,
  PhoneIcon,
} from 'react-native-heroicons/solid';
import {InformationCircleIcon} from 'react-native-heroicons/outline';
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {CallLogType, RootStackParamsList} from '../types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const CallLogPreview = ({callLog}: {callLog: CallLogType}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  const makeCall = useCallback(
    () => RNImmediatePhoneCall.immediatePhoneCall(callLog.phoneNumber),
    [callLog],
  );
  return (
    <Pressable
      style={tw`flex-row px-5 justify-between items-center mb-8`}
      onPress={makeCall}>
      <View style={tw`flex-row gap-x-5 items-center`}>
        {callLog.type === 'OUTGOING' && (
          <PhoneArrowUpRightIcon color={'gray'} size={17} />
        )}
        {(callLog.type === 'INCOMING' || callLog.type === 'UNKNOWN') && (
          <PhoneArrowDownLeftIcon color={'gray'} size={17} />
        )}

        {callLog.type === 'MISSED' && (
          <PhoneIcon
            color={'red'}
            size={17}
            style={{transform: [{rotate: '135deg'}]}}
          />
        )}

        <View>
          <Text
            style={tw`${
              callLog.type === 'MISSED' ? 'text-rose-500' : 'text-black'
            } text-lg`}>
            {callLog.name ? callLog.name : callLog?.phoneNumber}
          </Text>
          <Text style={tw`${callLog.type === 'MISSED' ? 'text-rose-500' : ''}`}>
            {callLog.name ? callLog.phoneNumber : 'Unknown'}
          </Text>
        </View>
      </View>
      <Pressable onPress={() => navigation.navigate('CallInfo', {callLog})}>
        <InformationCircleIcon color={'black'} size={23} />
      </Pressable>
    </Pressable>
  );
};

export default memo(CallLogPreview);
