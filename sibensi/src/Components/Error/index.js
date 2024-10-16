import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {COLORS, IlCalenderIcon} from '../../Assets';

const ErrorComponent = ({text}) => {
  return (
    <View style={styles.STContainer}>
      <View style={styles.contentNull}>
        <View style={styles.cardContentNull}>
          <Image source={IlCalenderIcon} style={{width: 150, height: 150}} />
          <Text style={styles.textContentNull}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  STContainer: {
    flex: 1,
  },
  contentNull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cardContentNull: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    width: '100%',
    height: 400,
    backgroundColor: COLORS.white,
    elevation: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContentNull: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    width: 280,
  },
});

export default ErrorComponent;
