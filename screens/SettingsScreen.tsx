import {View, Text} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import SafeView from '../components/SafeView';
import SecondaryHeader from '../components/SecondaryHeader';
import tw from 'twrnc';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallLogs} from '../hooks/useCallLogs';

const SettingsScreen = () => {
  const {getCallLogs} = useCallLogs();

  const [numberOfCallLogs, setNumberOfCallLogs] = useState(50);

  const getNumberOfCallLogs = useCallback(async () => {
    const storedNumberOfCallLogs = await AsyncStorage.getItem(
      'number-of-call-logs',
    );

    if (storedNumberOfCallLogs) {
      setNumberOfCallLogs(parseInt(storedNumberOfCallLogs));
    }
  }, []);

  const changeNumberOfCallLogs = useCallback(async (value: number) => {
    await AsyncStorage.setItem('number-of-call-logs', value.toString());
    setNumberOfCallLogs(value);
    getCallLogs();
  }, []);

  useEffect(() => {
    getNumberOfCallLogs();
  }, []);
  return (
    <SafeView>
      <SecondaryHeader title="Settings" />

      <View style={tw`pt-8`}>
        <View style={tw`border-b border-b-gray-300 pb-8 px-5`}>
          <Text style={tw`text-black text-base`}>Number of call logs</Text>
          <View style={tw`-mx-3`}>
            <Picker
              selectedValue={numberOfCallLogs}
              onValueChange={changeNumberOfCallLogs}>
              <Picker.Item label="10" value={10} />
              <Picker.Item label="30" value={30} />
              <Picker.Item label="40" value={40} />
              <Picker.Item label="50" value={50} />
              <Picker.Item label="100" value={100} />
            </Picker>
          </View>
        </View>
        <View style={tw`px-5 pt-8`}>
          <Text style={tw`text-black text-lg font-medium`}>Phone</Text>
          <Text>Version 1.0.0</Text>
        </View>
      </View>
    </SafeView>
  );
};

export default SettingsScreen;
