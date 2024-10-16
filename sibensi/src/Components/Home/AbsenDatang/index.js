import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS} from '../../../Assets';

const AbsenDatangComponent = ({startTimeAbsen, endTimeAbsen, text}) => {
  return (
    <View>
      <Text style={styles.textWhiteBold}>{text}</Text>
      <Text style={styles.textWhiteBold}>
        Pukul {startTimeAbsen} - {endTimeAbsen} WITA
      </Text>
    </View>
  );
};

export default AbsenDatangComponent;
const styles = StyleSheet.create({
  textWhiteBold: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
