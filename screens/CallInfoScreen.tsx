import {View, Text, Pressable} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import SafeView from '../components/SafeView';
import SecondaryHeader from '../components/SecondaryHeader';
import tw from 'twrnc';
import {useRoute} from '@react-navigation/native';
import {CallLogType} from '../types';
import {UserIcon, PhoneIcon} from 'react-native-heroicons/solid';
// @ts-ignore
import CallLogs from 'react-native-call-log';
// @ts-ignore
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

const CallInfoScreen = () => {
  const route = useRoute();
  const {callLog}: {callLog: CallLogType} = route.params as never;

  const [callLogs, setCallLogs] = useState<CallLogType[]>([]);

  const getCallLogs = useCallback(() => {
    CallLogs.load(6, {
      phoneNumbers: callLog.phoneNumber,
    }).then((res: CallLogType[]) => {
      setCallLogs(res);
    });
  }, [callLog]);

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
    <SafeView>
      <SecondaryHeader title="Details" />

      <View style={tw`py-8 items-center gap-y-6 border-b border-b-gray-300`}>
        <View style={tw`bg-gray-300 p-5 rounded-full`}>
          <UserIcon color={'white'} size={60} />
        </View>
        <View style={tw`items-center gap-y-1.5`}>
          <Text style={tw`text-black font-semibold text-3xl`}>
            {callLog.name ? callLog.name : callLog.phoneNumber}
          </Text>
          <Text style={tw`font-semibold`}>
            {callLog.name ? callLog.phoneNumber : 'Unknown'}
          </Text>
        </View>

        <View style={tw`items-center gap-y-2`}>
          <Pressable
            style={tw`bg-green-500 p-3 rounded-full`}
            onPress={() =>
              RNImmediatePhoneCall.immediatePhoneCall(callLog.phoneNumber)
            }>
            <PhoneIcon color={'white'} size={25} />
          </Pressable>
          <Text style={tw`text-black text-base`}>Call</Text>
        </View>
      </View>

      <View style={tw`gap-y-5 px-5 mt-8`}>
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
                {callLog.dateTime.substring(0, callLog.dateTime.length - 6)}{' '}
                {callLog.dateTime.substring(
                  callLog.dateTime.length - 2,
                  callLog.dateTime.length,
                )}
              </Text>
            </View>
          );
        })}
      </View>
    </SafeView>
  );
};

export default CallInfoScreen;
