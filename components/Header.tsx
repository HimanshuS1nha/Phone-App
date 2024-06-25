import {View, Text, Pressable} from 'react-native';
import React, {memo} from 'react';
import tw from 'twrnc';
import {EllipsisVerticalIcon} from 'react-native-heroicons/outline';

const Header = ({
  title,
  setIsVisible,
}: {
  title: string;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <View style={tw`pt-4 pb-10 flex-row px-5 justify-between items-center`}>
      <Text style={tw`text-4xl font-medium text-black`}>{title}</Text>
      <Pressable onPress={() => setIsVisible(prev => !prev)}>
        <EllipsisVerticalIcon size={30} color={'black'} />
      </Pressable>
    </View>
  );
};

export default memo(Header);
