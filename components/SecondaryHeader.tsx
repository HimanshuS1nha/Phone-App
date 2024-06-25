import {View, Text, Pressable} from 'react-native';
import React, {memo} from 'react';
import tw from 'twrnc';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';

const SecondaryHeader = ({title}: {title: string}) => {
  const navigation = useNavigation();
  return (
    <View
      style={tw`flex-row px-5 gap-x-4 items-center py-4 border-b border-b-gray-300`}>
      <Pressable onPress={navigation.goBack}>
        <ChevronLeftIcon color={'black'} size={24} />
      </Pressable>
      <Text style={tw`font-semibold text-black text-lg`}>{title}</Text>
    </View>
  );
};

export default memo(SecondaryHeader);
