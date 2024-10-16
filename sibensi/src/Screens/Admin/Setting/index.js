import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../../Assets';
import {LoadingComponent, MaterialIcon} from '../../../Components';
import DatePicker from 'react-native-date-picker';
import {getSetting, updateSetting} from '../../../Utils';
import {useModal} from 'react-native-modal-message';

const SettingScreen = ({navigation}) => {
  const [openDateJamAwalMasuk, setOpenDateJamAwalMasuk] = useState(false);
  const [openDateJamAkhirMasuk, setOpenDateJamAkhirMasuk] = useState(false);
  const [openDateJamAwalKeluar, setOpenDateJamAwalKeluar] = useState(false);
  const [openDateJamAkhirKeluar, setOpenDateJamAkhirKeluar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {showSuccessModal} = useModal();

  const [formData, setFormData] = useState({
    jamAwalMasuk: '',
    jamAkhirMasuk: '',
    jamAwalKeluar: '',
    jamAkhirKeluar: '',
  });

  const AmbilData = async () => {
    try {
      const response = await getSetting(1);
      setFormData({
        jamAwalMasuk: response.data.response.jam_absen_datang,
        jamAkhirMasuk: response.data.response.jam_akhir_absen_datang,
        jamAwalKeluar: response.data.response.jam_absen_pulang,
        jamAkhirKeluar: response.data.response.jam_akhir_absen_pulang,
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  const HandleSave = async () => {
    try {
      setIsLoading(true);
      const response = await updateSetting(1, formData);
      if (response.status == 200) {
        showSuccessModal('Jam absensi berhasil di ubah!', 'Oke', () => {
          navigation.goBack();
        });
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AmbilData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={{gap: 10}}>
            <Text style={styles.textLabel}>Jam Awal Absen Masuk :</Text>
            <View style={styles.formInput}>
              <TextInput
                placeholder="hh:mm:ss"
                style={styles.input}
                placeholderTextColor={COLORS.greyOld}
                editable={false}
                value={formData.jamAwalMasuk}
              />
              <TouchableOpacity
                style={styles.buttonCalendar}
                onPress={() => setOpenDateJamAwalMasuk(true)}>
                <MaterialIcon
                  name={'calendar-range'}
                  size={24}
                  color={COLORS.greyOld}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{gap: 10}}>
            <Text style={styles.textLabel}>Jam Akhir Absen Masuk :</Text>
            <View style={styles.formInput}>
              <TextInput
                placeholder="hh:mm:ss"
                style={styles.input}
                placeholderTextColor={COLORS.greyOld}
                editable={false}
                value={formData.jamAkhirMasuk}
              />
              <TouchableOpacity
                style={styles.buttonCalendar}
                onPress={() => setOpenDateJamAkhirMasuk(true)}>
                <MaterialIcon
                  name={'calendar-range'}
                  size={24}
                  color={COLORS.greyOld}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{gap: 10}}>
            <Text style={styles.textLabel}>Jam Awal Absen Keluar :</Text>
            <View style={styles.formInput}>
              <TextInput
                placeholder="hh:mm:ss"
                style={styles.input}
                placeholderTextColor={COLORS.greyOld}
                editable={false}
                value={formData.jamAwalKeluar}
              />
              <TouchableOpacity
                style={styles.buttonCalendar}
                onPress={() => setOpenDateJamAwalKeluar(true)}>
                <MaterialIcon
                  name={'calendar-range'}
                  size={24}
                  color={COLORS.greyOld}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{gap: 10}}>
            <Text style={styles.textLabel}>Jam Akhir Absen Keluar :</Text>
            <View style={styles.formInput}>
              <TextInput
                placeholder="hh:mm:ss"
                style={styles.input}
                placeholderTextColor={COLORS.greyOld}
                editable={false}
                value={formData.jamAkhirKeluar}
              />
              <TouchableOpacity
                style={styles.buttonCalendar}
                onPress={() => setOpenDateJamAkhirKeluar(true)}>
                <MaterialIcon
                  name={'calendar-range'}
                  size={24}
                  color={COLORS.greyOld}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.buttonSave} onPress={HandleSave}>
            <Text style={styles.textButton}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <DatePicker
        modal
        open={openDateJamAwalMasuk}
        date={new Date()}
        onConfirm={date => {
          const jam = date.getHours();
          const menit = date.getMinutes();
          const detik = date.getSeconds();
          const formattedTime = `${jam < 10 ? `0${jam}` : jam}:${
            menit < 10 ? `0${menit}` : menit
          }:${detik < 10 ? `0${detik}` : detik}`;
          setOpenDateJamAwalMasuk(false);
          setFormData({
            ...formData,
            jamAwalMasuk: formattedTime,
          });
        }}
        onCancel={() => {
          setOpenDateJamAwalMasuk(false);
        }}
        mode="time"
        theme="dark"
      />
      <DatePicker
        modal
        open={openDateJamAkhirMasuk}
        date={new Date()}
        onConfirm={date => {
          const jam = date.getHours();
          const menit = date.getMinutes();
          const detik = date.getSeconds();
          const formattedTime = `${jam < 10 ? `0${jam}` : jam}:${
            menit < 10 ? `0${menit}` : menit
          }:${detik < 10 ? `0${detik}` : detik}`;
          setOpenDateJamAkhirMasuk(false);
          setFormData({
            ...formData,
            jamAkhirMasuk: formattedTime,
          });
        }}
        onCancel={() => {
          setOpenDateJamAkhirMasuk(false);
        }}
        mode="time"
        theme="dark"
      />
      <DatePicker
        modal
        open={openDateJamAwalKeluar}
        date={new Date()}
        onConfirm={date => {
          const jam = date.getHours();
          const menit = date.getMinutes();
          const detik = date.getSeconds();
          const formattedTime = `${jam < 10 ? `0${jam}` : jam}:${
            menit < 10 ? `0${menit}` : menit
          }:${detik < 10 ? `0${detik}` : detik}`;
          setOpenDateJamAwalKeluar(false);
          setFormData({
            ...formData,
            jamAwalKeluar: formattedTime,
          });
        }}
        onCancel={() => {
          setOpenDateJamAwalKeluar(false);
        }}
        mode="time"
        theme="dark"
      />
      <DatePicker
        modal
        open={openDateJamAkhirKeluar}
        date={new Date()}
        onConfirm={date => {
          const jam = date.getHours();
          const menit = date.getMinutes();
          const detik = date.getSeconds();
          const formattedTime = `${jam < 10 ? `0${jam}` : jam}:${
            menit < 10 ? `0${menit}` : menit
          }:${detik < 10 ? `0${detik}` : detik}`;
          setOpenDateJamAkhirKeluar(false);
          setFormData({
            ...formData,
            jamAkhirKeluar: formattedTime,
          });
        }}
        onCancel={() => {
          setOpenDateJamAkhirKeluar(false);
        }}
        mode="time"
        theme="dark"
      />
      {isLoading && <LoadingComponent />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: 20,
    marginVertical: 20,
    gap: 20,
  },
  textLabel: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '600',
  },
  input: {
    color: COLORS.black,
    borderWidth: 1,
    paddingVertical: 8,
    paddingLeft: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
    width: '100%',
  },
  formInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonCalendar: {
    position: 'absolute',
    right: 12,
  },
  buttonSave: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
  },
  textButton: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '700',
  },
});

export default SettingScreen;
