import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS} from '../../../Assets';

const DataProfileComponent = ({value}) => {
  return (
    <View style={styles.contentForm}>
      <TextInput style={styles.formInput} value={value} readOnly={true} />
    </View>
  );
};

export default DataProfileComponent;
const styles = StyleSheet.create({
  formInput: {
    borderBottomWidth: 1,
    color: COLORS.black,
    borderColor: COLORS.grey,
    fontSize: 20,
  },
  contentForm: {
    marginTop: 10,
    marginBottom: 10,
  },
});
