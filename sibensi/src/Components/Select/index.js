import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Picker} from '@react-native-picker/picker';
import {COLORS} from '../../Assets';

const Select = ({data, onValueChange, value, style}) => {
  return (
    <View style={[styles.container, style]}>
      <Picker
        onValueChange={(item, index) => {
          onValueChange(item);
        }}
        selectedValue={value}>
        {data.map((item, index) => (
          <Picker.Item
            key={index}
            style={{
              fontSize: 16,
              color: index === 0 ? COLORS.greyOld : COLORS.white,
            }}
            label={item.label}
            value={item.value}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    fontSize: 16,
    color: COLORS.black,
    borderBottomColor: COLORS.black,
  },
});

export default Select;
