import {View, Text, SafeAreaView, StyleProp, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import tw from 'twrnc';

const SafeView = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <SafeAreaView style={[tw`bg-white flex-1`, style]}>{children}</SafeAreaView>
  );
};

export default memo(SafeView);
