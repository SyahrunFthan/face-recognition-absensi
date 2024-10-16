import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS} from '../../Assets';

const Input = ({onChangeText, value, placeholder, error, style, ...props}) => {
  return (
    <TextInput
      {...props}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={[styles.input, style]}
      placeholderTextColor={COLORS.greyOld}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    fontSize: 16,
    color: COLORS.black,
    borderBottomColor: COLORS.black,
    width: '100%',
  },
});

export default Input;
