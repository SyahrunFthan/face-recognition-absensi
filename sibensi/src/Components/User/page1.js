import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../Assets';
import Input from '../Input';
import Select from '../Select';
import DatePicker from 'react-native-date-picker';
import MaterialIcon from '../MeterialIcon';
import moment from 'moment';

const Page1 = ({onClickNext, formData, setFormData, formError}) => {
  const [openDate, setOpendate] = useState(false);
  const dateValue = formData.tanggalLahir;
  const tanggalLahir = moment(dateValue).format('DD MMMM YYYY');

  const jenkel = [
    {
      label: '-- Pilih Jenis Kelamin --',
      value: '',
    },
    {
      label: 'Laki-Laki',
      value: 'L',
    },
    {
      label: 'Perempuan',
      value: 'P',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={{gap: 4}}>
        <Input
          placeholder={'Nomor Induk Pegawai'}
          style={{
            borderBottomColor: formError.nip ? COLORS.red : COLORS.black,
          }}
          value={formData.nip}
          onChangeText={text => setFormData({...formData, nip: text})}
          keyboardType="numeric"
        />
        {formError.nip && (
          <Text style={{color: COLORS.red}}>{formError.nip}</Text>
        )}
      </View>
      <View style={{gap: 4}}>
        <Input
          placeholder={'Nomor Induk Kependudukan'}
          style={{
            borderBottomColor: formError.nik ? COLORS.red : COLORS.black,
          }}
          value={formData.nik}
          onChangeText={text => setFormData({...formData, nik: text})}
          keyboardType="numeric"
        />
        {formError.nik && (
          <Text style={{color: COLORS.red}}>{formError.nik}</Text>
        )}
      </View>
      <View style={{gap: 4}}>
        <Input
          placeholder={'Nama'}
          style={{
            borderBottomColor: formError.nama ? COLORS.red : COLORS.black,
          }}
          value={formData.nama}
          onChangeText={text => setFormData({...formData, nama: text})}
        />
        {formError.nama && (
          <Text style={{color: COLORS.red}}>{formError.nama}</Text>
        )}
      </View>

      <View style={{gap: 4}}>
        <Select
          data={jenkel}
          value={formData.gander}
          onValueChange={value => setFormData({...formData, gander: value})}
          style={{
            borderBottomColor: formError.gander ? COLORS.red : COLORS.black,
          }}
        />
        {formError.gander && (
          <Text style={{color: COLORS.red}}>{formError.gander}</Text>
        )}
      </View>

      <View style={{gap: 4}}>
        <Input
          placeholder={'Tempat Lahir'}
          value={formData.tempatLahir}
          onChangeText={text => setFormData({...formData, tempatLahir: text})}
          style={{
            borderBottomColor: formError.tempatLahir
              ? COLORS.red
              : COLORS.black,
          }}
        />
        {formError.tempatLahir && (
          <Text style={{color: COLORS.red}}>{formError.tempatLahir}</Text>
        )}
      </View>

      <View style={{gap: 4}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Input
            placeholder={'Tanggal Lahir'}
            value={tanggalLahir}
            editable={false}
            style={{
              borderBottomColor: formError.tanggalLahir
                ? COLORS.red
                : COLORS.black,
            }}
          />
          <TouchableOpacity
            style={{position: 'absolute', right: 12}}
            onPress={() => setOpendate(true)}>
            <MaterialIcon
              name={'calendar-range'}
              size={28}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        {formError.tanggalLahir && (
          <Text style={{color: COLORS.red}}>{formError.tanggalLahir}</Text>
        )}
      </View>

      <TouchableOpacity onPress={onClickNext} style={styles.buttonNext}>
        <Text style={{color: COLORS.white, fontSize: 22, fontWeight: '700'}}>
          Next
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openDate}
        date={formData.tanggalLahir}
        onConfirm={date => {
          setOpendate(false);
          setFormData({...formData, tanggalLahir: date});
        }}
        onCancel={() => {
          setOpendate(false);
        }}
        mode="date"
        maximumDate={new Date()}
        minimumDate={new Date('1950-12-12')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 30,
  },
  buttonNext: {
    marginTop: 30,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
});
export default Page1;
