import {View, Text, ScrollView} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import SafeView from '../components/SafeView';
import SecondaryHeader from '../components/SecondaryHeader';
import {CallLogType} from '../types';
// @ts-ignore
import CallLogs from 'react-native-call-log';
import {useRoute} from '@react-navigation/native';
import tw from 'twrnc';

const CallLogsScreen = () => {
  const route = useRoute();
  const callLog: {
    name: string;
    phoneNumbers: {number: string; label: string}[];
  } = route.params as never;

  const [callLogs, setCallLogs] = useState<CallLogType[]>([]);

  const getCallLogs = useCallback(() => {
    CallLogs.load(25, {
      phoneNumbers: callLog.phoneNumbers.map(phoneNumber =>
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
      <SecondaryHeader title="Call Logs" />
      <ScrollView>
        <View style={tw`gap-y-6 px-5 mt-5`}>
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
      </ScrollView>
    </SafeView>
  );
};

export default CallLogsScreen;
