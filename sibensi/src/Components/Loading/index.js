import {View, ActivityIndicator, StyleSheet, Text, Modal} from 'react-native';
import React from 'react';
import {COLORS} from '../../Assets';

const LoadingComponent = () => {
  return (
    <Modal visible={true} transparent={true}>
      <View style={styles.container}>
        <View style={styles.STCardLoading}>
          <ActivityIndicator size={'large'} color={'#0000ff'} />
          <Text style={styles.STTextLoading}>Loading....</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingComponent;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  STCardLoading: {
    borderWidth: 1,
    borderColor: COLORS.greyOld,
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.transparent,
    opacity: 0.5,
    borderRadius: 10,
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 0.5,
  },
  STTextLoading: {
    marginTop: 10,
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
