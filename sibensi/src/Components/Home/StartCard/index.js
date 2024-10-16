import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS} from '../../../Assets';

const StartCardComponent = ({icon, total, label}) => {
  return (
    <View style={styles.statCard}>
      {icon}
      <Text style={styles.statNumber}>{total}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    width: 81,
    height: 78,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default StartCardComponent;
