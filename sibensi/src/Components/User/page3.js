import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {COLORS, IlDefault} from '../../Assets';
import MaterialIcon from '../MeterialIcon';
import Input from '../Input';
import {launchImageLibrary} from 'react-native-image-picker';

const Page3 = ({
  formData,
  setFormData,
  onClickBack,
  onSave,
  formError,
  setFormError,
}) => {
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.errorCode) {
        setFormData({...formData, file: response.assets[0]});
      } else {
        return null;
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={{gap: 4, alignItems: 'center', marginTop: 20}}>
        <View style={{width: 135, height: 135}}>
          <Image
            source={formData.file.uri ? {uri: formData.file.uri} : IlDefault}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              objectFit: 'cover',
              borderWidth: 1,
              borderColor: COLORS.primary,
            }}
          />
          <TouchableOpacity
            style={{position: 'absolute', right: 5, bottom: 5}}
            onPress={selectImage}>
            <MaterialIcon name={'plus'} color={COLORS.black} size={48} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{gap: 4}}>
        <Input
          placeholder={'File'}
          value={formData.file.fileName}
          style={{
            borderBottomColor: formError.file ? COLORS.red : COLORS.black,
          }}
        />
        {formError.file && (
          <Text style={{color: COLORS.red}}>{formError.file}</Text>
        )}
      </View>
      <View style={styles.contentButton}>
        <TouchableOpacity onPress={onSave} style={styles.button}>
          <Text style={styles.textButton}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onClickBack}
          style={[styles.button, {backgroundColor: COLORS.red}]}>
          <Text style={styles.textButton}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 30,
  },
  contentButton: {
    marginTop: 30,
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    flex: 1,
    width: '100%',
  },
  textButton: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },
});
export default Page3;
