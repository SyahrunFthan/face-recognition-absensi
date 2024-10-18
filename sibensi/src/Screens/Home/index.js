import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import {
  AbsenDatangComponent,
  AttendanceComponent,
  HeaderComponent,
  IonIcon,
  MaterialIcon,
  StartCardComponent,
} from '../../Components';
import {useDispatch} from 'react-redux';
import {GetUserLogin} from '../../Features/userSlice';
import {getItem} from '../../Utils';
import moment from 'moment-timezone';

const HomeScreen = ({navigation}) => {
  const [profile, setProfile] = useState();
  const [attendance, setAttendance] = useState([]);
  const [totalIzin, setTotalIzin] = useState(0);
  const [totalSakit, setTotalSakit] = useState(0);
  const [totalHadir, setTotalHadir] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [jamAbsen, setJamAbsen] = useState([]);
  const dispatch = useDispatch();

  // Ambil Data To Backend
  const AmbilData = async () => {
    setRefreshing(false);
    try {
      const response = await getItem('profile');
      const res = await dispatch(GetUserLogin({id: response?.data?.userId}));
      setProfile(res?.payload?.data?.response);
      setTotalHadir(res?.payload?.data?.hadir);
      setTotalIzin(res?.payload?.data?.izin);
      setTotalSakit(res?.payload?.data?.sakit);
      setAttendance(res?.payload?.data?.attendance);
      setJamAbsen(res?.payload?.data?.jamAbsen);
    } catch (error) {
      console.log(error);
    }
  };

  const hariAbsen = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const today = moment().tz('Asia/Makassar').format('dddd');
  const hariIni = moment().tz('Asia/Makassar').format('dddd, LL');
  const jamHariIni = moment.tz('Asia/Makassar').format('HH:mm:ss');

  useEffect(() => {
    AmbilData();
  }, []);

  const refreshControl = () => {
    setRefreshing(true);
    AmbilData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent profile={profile} />
      <LinearGradient colors={['#2e1ba2', '#4e4e51']} style={styles.gradient}>
        <View style={styles.statsContainer}>
          <StartCardComponent
            icon={
              <IonIcon name={'person-outline'} size={30} color={COLORS.black} />
            }
            label="Hadir"
            total={totalHadir}
          />
          <StartCardComponent
            icon={
              <MaterialIcon
                name={'emoticon-sick-outline'}
                size={30}
                color={COLORS.black}
              />
            }
            label="Sakit"
            total={totalSakit}
          />
          <StartCardComponent
            icon={
              <MaterialIcon
                name={'clock-outline'}
                size={30}
                color={COLORS.black}
              />
            }
            label="Izin"
            total={totalIzin}
          />
        </View>
        <View style={styles.dateSection}>
          <View>
            <Text style={styles.textWhiteBold}>{hariIni}</Text>
            {hariAbsen.includes(today) &&
              (jamHariIni > jamAbsen.jam_absen_datang &&
              jamHariIni < jamAbsen.jam_akhir_absen_datang ? (
                <>
                  <AbsenDatangComponent
                    startTimeAbsen={moment(
                      jamAbsen.jam_absen_datang,
                      'HH:mm:ss',
                    ).format('HH.mm')}
                    endTimeAbsen={moment(
                      jamAbsen.jam_akhir_absen_datang,
                      'HH:mm:ss',
                    ).format('HH.mm')}
                    text={'Absen Masuk di Mulai'}
                  />
                </>
              ) : jamHariIni > jamAbsen.jam_absen_pulang &&
                jamHariIni < jamAbsen.jam_akhir_absen_pulang ? (
                <>
                  <AbsenDatangComponent
                    startTimeAbsen={moment(
                      jamAbsen.jam_absen_pulang,
                      'HH:mm:ss',
                    ).format('HH.mm')}
                    endTimeAbsen={moment(
                      jamAbsen.jam_akhir_absen_pulang,
                      'HH:mm:ss',
                    ).format('HH.mm')}
                    text={'Absen Pulang di Mulai'}
                  />
                </>
              ) : (
                <View>
                  <Text style={[styles.textWhiteBold, {fontSize: 16}]}>
                    Tidak Ada Jam Absen Sekarang!
                  </Text>
                </View>
              ))}
          </View>
          {hariAbsen.includes(today) &&
            (jamHariIni > jamAbsen.jam_absen_datang &&
            jamHariIni < jamAbsen.jam_akhir_absen_datang ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('Absensi')}
                style={[styles.buttonCheck, {backgroundColor: COLORS.success}]}>
                <Text style={styles.textButton}>Check In</Text>
              </TouchableOpacity>
            ) : jamHariIni > jamAbsen.jam_absen_pulang &&
              jamHariIni < jamAbsen.jam_akhir_absen_pulang ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('Absensi')}
                style={[styles.buttonCheck, {backgroundColor: COLORS.red}]}>
                <Text style={styles.textButton}>Check Out</Text>
              </TouchableOpacity>
            ) : null)}
        </View>
      </LinearGradient>
      <AttendanceComponent
        attendance={attendance}
        refreshing={refreshing}
        refreshControl={refreshControl}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  viewError: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  gradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  statsContainer: {
    borderColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
  },
  dateSection: {
    marginTop: 30,
    alignItems: 'center',
    gap: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },
  textWhiteBold: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  buttonCheck: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 30,
    padding: 2,
    alignItems: 'center',
  },
  textButton: {
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
