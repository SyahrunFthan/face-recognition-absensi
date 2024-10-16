import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../Assets';
import Input from '../Input';
import Select from '../Select';
import DatePicker from 'react-native-date-picker';
import MaterialIcon from '../MeterialIcon';
import moment from 'moment';

const Page2 = ({
  onClickBack,
  onClickNext,
  formData,
  setFormData,
  formError,
}) => {
  const agama = [
    {
      label: '-- Pilih Agama --',
      value: '',
    },
    {
      label: 'Islam',
      value: 'Islam',
    },
    {
      label: 'Kristen',
      value: 'Kristen',
    },
    {
      label: 'Hindu',
      value: 'Hindu',
    },
    {
      label: 'Budha',
      value: 'Budha',
    },
    {
      label: 'Katholik',
      value: 'Katholik',
    },
    {
      label: 'Kong Hu Chu',
      value: 'Kong Hu Chu',
    },
  ];

  const status = [
    {
      label: '-- Pilih Status Nikah --',
      value: '',
    },
    {
      label: 'Sudah Menikah',
      value: 'Nikah',
    },
    {
      label: 'Belum Menikah',
      value: 'Belum Nikah',
    },
  ];

  const jabatan = [
    {
      label: '-- Pilih Jabatan --',
      value: '',
    },
    {
      label: 'Irban 1',
      value: 'Irban 1',
    },
    {
      label: 'Irban 2',
      value: 'Irban 2',
    },
    {
      label: 'Irban 3',
      value: 'Irban 3',
    },
    {
      label: 'Irban 4',
      value: 'Irban 4',
    },
  ];
  return (
    <View style={styles.container}>
      <View style={{gap: 4}}>
        <Input
          placeholder={'Nomor Telpon'}
          value={formData.telpon}
          onChangeText={text => setFormData({...formData, telpon: text})}
          inputMode="tel"
          style={{
            borderBottomColor: formError.telpon ? COLORS.red : COLORS.black,
          }}
        />
        {formError.telpon && (
          <Text style={{color: COLORS.red}}>{formError.telpon}</Text>
        )}
      </View>
      <View style={{gap: 4}}>
        <Select
          data={agama}
          value={formData.agama}
          onValueChange={value => setFormData({...formData, agama: value})}
          style={{
            borderBottomColor: formError.agama ? COLORS.red : COLORS.black,
          }}
        />
        {formError.agama && (
          <Text style={{color: COLORS.red}}>{formError.agama}</Text>
        )}
      </View>
      <View style={{gap: 4}}>
        <Select
          data={status}
          value={formData.statusNikah}
          onValueChange={value =>
            setFormData({...formData, statusNikah: value})
          }
          style={{
            borderBottomColor: formError.statusNikah
              ? COLORS.red
              : COLORS.black,
          }}
        />
        {formError.statusNikah && (
          <Text style={{color: COLORS.red}}>{formError.statusNikah}</Text>
        )}
      </View>
      <View style={{gap: 4}}>
        <Select
          data={jabatan}
          value={formData.jabatan}
          onValueChange={value => setFormData({...formData, jabatan: value})}
          style={{
            borderBottomColor: formError.jabatan ? COLORS.red : COLORS.black,
          }}
        />
        {formError.jabatan && (
          <Text style={{color: COLORS.red}}>{formError.jabatan}</Text>
        )}
      </View>
      <View style={{gap: 4}}>
        <Input
          placeholder={'Alamat'}
          value={formData.alamat}
          onChangeText={text => setFormData({...formData, alamat: text})}
          numberOfLines={4}
          multiline={true}
          style={[
            styles.textArea,
            {
              borderColor: formError.alamat ? COLORS.red : COLORS.greyOld,
            },
          ]}
        />
        {formError.alamat && (
          <Text style={{color: COLORS.red}}>{formError.alamat}</Text>
        )}
      </View>
      <View style={styles.contentButton}>
        <TouchableOpacity
          onPress={onClickBack}
          style={[styles.button, {backgroundColor: COLORS.red}]}>
          <Text style={styles.textButton}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClickNext} style={styles.button}>
          <Text style={styles.textButton}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 30,
  },
  textArea: {
    height: 100,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: 'top',
  },
  contentButton: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10%',
    flex: 1,
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    flex: 1,
  },
  textButton: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },
});
export default Page2;
