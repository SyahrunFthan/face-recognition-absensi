import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  TouchableWithoutFeedback,
  TextInput,
  RefreshControl,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, IlDefault} from '../../../Assets';
import {
  ErrorComponent,
  IonIcon,
  LoadingComponent,
  MaterialIcon,
} from '../../../Components';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {getKehadiran} from '../../../Utils';
import {useFocusEffect} from '@react-navigation/native';

const KehadiranAdminScreen = () => {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [openDateawal, setOpenDateawal] = useState(false);
  const [openDateakhir, setOpenDateakhir] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [formData, setFormData] = useState({
    tanggalAwal: new Date('2024-01-01'),
    tanggalAkhir: new Date(),
  });

  const dateAwal = moment(formData.tanggalAwal).format('DD MMMM YYYY');
  const dateAkhir = moment(formData.tanggalAkhir).format('DD MMMM YYYY');

  const HandleSearch = () => {
    setModal(false);
    AmbilData();
  };

  const AmbilData = async () => {
    try {
      const userData = {};
      setIsLoading(true);
      const response = await getKehadiran(
        formData.tanggalAwal,
        formData.tanggalAkhir,
      );
      response.data.response.forEach(item => {
        const {nama} = item.user;
        const {tanggal_absensi} = item;

        if (!userData[nama]) {
          userData[nama] = {
            url: item.user.url,
            tanggal: tanggal_absensi,
            absensi: {
              hadir: 0,
              izin: 0,
              sakit: 0,
            },
          };
        }

        if (item.status_kehadiran == 'Hadir') {
          userData[nama].absensi.hadir += 1;
        } else if (item.status_kehadiran == 'Izin') {
          userData[nama].absensi.izin += 1;
        } else if (item.status_kehadiran == 'Sakit') {
          userData[nama].absensi.sakit += 1;
        }
      });
      setData(userData);
    } catch (error) {
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setFormData({
        tanggalAwal: new Date('2024-01-01'),
        tanggalAkhir: new Date(),
      });
      AmbilData();
    }, []),
  );

  const HandleRefresh = () => {
    setRefresh(true);
    setFormData({
      tanggalAwal: new Date('2024-01-01'),
      tanggalAkhir: new Date(),
    });
    AmbilData();
    setRefresh(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={HandleRefresh} />
        }>
        <View style={styles.content}>
          {Object.keys(data).length > 0 ? (
            Object.keys(data).map((item, index) => (
              <View style={styles.card} key={index}>
                <Image
                  source={data[item].url ? {uri: data[item].url} : IlDefault}
                  style={styles.imageCard}
                />
                <View style={{gap: 2}}>
                  <Text style={styles.textBold}>{item}</Text>
                  <Text style={styles.textNormal}>
                    Tanggal: {moment(data[item].tanggal).format('DD MMMM YYYY')}
                  </Text>
                  <Text style={styles.textNormal}>
                    Hadir: {data[item].absensi.hadir}
                  </Text>
                  <Text style={styles.textNormal}>
                    Izin: {data[item].absensi.izin}
                  </Text>
                  <Text style={styles.textNormal}>
                    Sakit: {data[item].absensi.sakit}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <ErrorComponent text={'Tidak Ada Data Kehadiran!'} />
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonSearch}
        onPress={() => setModal(true)}>
        <IonIcon name={'search-outline'} size={38} color={COLORS.white} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={() => setModal(false)}>
        <TouchableWithoutFeedback onPress={() => setModal(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{alignItems: 'flex-start'}}>
                <Text style={styles.modalText}>Start Date</Text>
                <View style={styles.contentForm}>
                  <TextInput
                    placeholder="Start Date"
                    placeholderTextColor={COLORS.greyOld}
                    style={styles.formInput}
                    editable={false}
                    value={dateAwal}
                  />
                  <TouchableOpacity
                    onPress={() => setOpenDateawal(true)}
                    style={styles.buttonCalendar}>
                    <MaterialIcon
                      name={'calendar-range'}
                      color={COLORS.greyOld}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{alignItems: 'flex-start', marginTop: 20}}>
                <Text style={styles.modalText}>End Date</Text>
                <View style={styles.contentForm}>
                  <TextInput
                    placeholder="End Date"
                    placeholderTextColor={COLORS.greyOld}
                    style={styles.formInput}
                    editable={false}
                    value={dateAkhir}
                  />
                  <TouchableOpacity
                    style={styles.buttonCalendar}
                    onPress={() => setOpenDateakhir(true)}>
                    <MaterialIcon
                      name={'calendar-range'}
                      color={COLORS.greyOld}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={HandleSearch}
                style={styles.buttonAction}>
                <Text style={styles.textButton}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <DatePicker
        modal
        open={openDateawal}
        date={formData.tanggalAwal}
        onConfirm={date => {
          setOpenDateawal(false);
          setFormData({...formData, tanggalAwal: date});
        }}
        onCancel={() => {
          setOpenDateawal(false);
        }}
        mode="date"
        maximumDate={new Date()}
        minimumDate={new Date('1950-12-12')}
      />

      <DatePicker
        modal
        open={openDateakhir}
        date={formData.tanggalAkhir}
        onConfirm={date => {
          setOpenDateakhir(false);
          setFormData({...formData, tanggalAkhir: date});
        }}
        onCancel={() => {
          setOpenDateakhir(false);
        }}
        mode="date"
        maximumDate={new Date()}
        minimumDate={new Date('1950-12-12')}
      />

      {isLoading && <LoadingComponent />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  viewError: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginHorizontal: 10,
    marginVertical: 10,
    gap: 6,
  },
  card: {
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderColor: '#d4d4d4',
    gap: 15,
  },
  imageCard: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  textBold: {
    color: COLORS.black,
    width: 210,
    fontSize: 18,
    fontWeight: '700',
  },
  textNormal: {
    color: COLORS.greyOld,
    width: 200,
    fontWeight: '600',
  },
  buttonSearch: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    padding: 8,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.grey,
    borderWidth: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    padding: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: '700',
    fontSize: 18,
  },
  contentForm: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
  },
  formInput: {
    borderWidth: 1,
    width: '100%',
    paddingVertical: 4,
    borderRadius: 10,
    paddingLeft: 15,
    borderColor: COLORS.grey,
    backgroundColor: COLORS.white,
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonCalendar: {
    position: 'absolute',
    right: 10,
  },
  buttonAction: {
    borderWidth: 1,
    width: '50%',
    marginTop: 30,
    paddingVertical: 4,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  textButton: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '600',
  },
});

export default KehadiranAdminScreen;
