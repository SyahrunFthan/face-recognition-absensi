import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS} from '../../../Assets';

const CardProfileComponent = ({nip, name, image}) => {
  return (
    <View style={styles.contentHeader}>
      <Image source={image} style={styles.image} />
      <View>
        <Text style={styles.textNormal}>{name}</Text>
        <Text style={[styles.textNormal, {fontWeight: '500'}]}>
          NIP : {nip}
        </Text>
      </View>
    </View>
  );
};

export default CardProfileComponent;
const styles = StyleSheet.create({
  contentHeader: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    borderColor: COLORS.grey,
  },
  image: {
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 30,
  },
  textNormal: {
    color: COLORS.black,
    fontSize: 20,
  },
});
