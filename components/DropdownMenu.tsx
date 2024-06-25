import {View, Text, Modal, Pressable} from 'react-native';
import React from 'react';
import tw from 'twrnc';

const DropdownMenu = ({
  isVisible,
  setIsVisible,
  options,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  options: {title: string; action: () => void}[];
}) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View
        style={tw`absolute bg-white shadow-lg shadow-black right-2 w-40 p-5 gap-y-5 top-[7%] z-20 rounded-lg`}>
        {options.map(option => {
          return (
            <Pressable
              key={option.title}
              onPress={() => {
                setIsVisible(false);
                option.action();
              }}>
              <Text style={tw`text-black text-base`}>{option.title}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => setIsVisible(false)}
        style={tw`flex-1`}></Pressable>
    </Modal>
  );
};

export default DropdownMenu;
