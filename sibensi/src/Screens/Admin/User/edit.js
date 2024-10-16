import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../../Assets';
import {LoadingComponent, Page1, Page2, Page3} from '../../../Components';
import {getUserByAdminApi, updateUserApi} from '../../../Utils';
import {useFocusEffect} from '@react-navigation/native';
import {useModal} from 'react-native-modal-message';

const EditScreen = ({route, navigation}) => {
  const [page, setPage] = useState('page1');
  const [isLoading, setIsLoading] = useState(false);
  const {id} = route.params;
  const {showSuccessModal} = useModal();

  const [formData, setFormData] = useState({
    nip: '',
    nik: '',
    nama: '',
    gander: '',
    tempatLahir: '',
    tanggalLahir: new Date(),
    telpon: '',
    agama: '',
    statusNikah: '',
    alamat: '',
    jabatan: '',
    file: null,
  });

  const [formError, setFormError] = useState({
    nip: '',
    nik: '',
    nama: '',
    gander: '',
    tempatLahir: '',
    tanggalLahir: '',
    telpon: '',
    agama: '',
    statusNikah: '',
    alamat: '',
    jabatan: '',
    file: '',
  });

  const handelToPage2 = () => {
    if (formData.nip == '')
      return setFormError({nip: 'NIP Tidak boleh kosong!'});
    if (formData.nik == '')
      return setFormError({nik: 'NIK Tidak boleh kosong!'});
    if (formData.nama == '')
      return setFormError({nama: 'Nama tidak boleh kosong!'});
    if (formData.gander == '') return setFormError({gander: 'Pilih Gander!'});
    if (formData.tempatLahir == '')
      return setFormError({tempatLahir: 'Tempat lahir tidak boleh kosong!'});
    if (
      formData.tanggalLahir.toISOString().split('T')[0] ==
      new Date().toISOString().split('T')[0]
    )
      return setFormError({tanggalLahir: 'Tanggal lahir tidak valid!'});
    setFormError({
      nip: '',
      nik: '',
      nama: '',
      gander: '',
      tempatLahir: '',
      tanggalLahir: '',
    });
    setPage('page2');
  };

  const AmbilData = async () => {
    try {
      const response = await getUserByAdminApi(id);
      setFormData({
        nip: response.data.response.nip,
        nik: response.data.response.nik,
        nama: response.data.response.nama,
        gander: response.data.response.jenis_kelamin,
        tempatLahir: response.data.response.tempat_lahir,
        tanggalLahir: new Date(response.data.response.tanggal_lahir),
        telpon: response.data.response.telpon,
        agama: response.data.response.agama,
        statusNikah: response.data.response.status_nikah,
        jabatan: response.data.response.jabatan,
        alamat: response.data.response.alamat,
        file: {
          uri: response.data.response.url,
          fileName: response.data.response.foto,
        },
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  const handelToPage3 = () => {
    if (formData.telpon == '')
      return setFormError({telpon: 'No Telpon tidak boleh kosong!'});
    if (formData.agama == '')
      return setFormError({agama: 'Pilih Agama Pengguna!'});
    if (formData.statusNikah == '')
      return setFormError({statusNikah: 'Pilih Status Nikah Pengguna!'});
    if (formData.jabatan == '')
      return setFormError({jabatan: 'Pilih Jabatan Pengguna!'});
    if (formData.alamat == '')
      return setFormError({alamat: 'Alamat tidak boleh kosong!'});
    setFormError({
      telpon: '',
      agama: '',
      statusNikah: '',
      jabatan: '',
      alamat: '',
    });
    setPage('page3');
  };

  const handleSave = async () => {
    if (formData.file == null)
      return setFormError({file: 'Wajib mengupload gambar!'});
    let form = new FormData();
    form.append('nip', formData.nip);
    form.append('nik', formData.nik);
    form.append('nama', formData.nama);
    form.append('jenisKelamin', formData.gander);
    form.append('tempatLahir', formData.tempatLahir);
    form.append(
      'tanggalLahir',
      formData.tanggalLahir.toISOString().split('T')[0],
    );
    form.append('telpon', formData.telpon);
    form.append('agama', formData.agama);
    form.append('statusNikah', formData.statusNikah);
    form.append('jabatan', formData.jabatan);
    form.append('alamat', formData.alamat);
    form.append('file', {
      uri: formData.file.uri,
      name: formData.file.fileName,
      type: 'image/jpeg',
    });

    try {
      setIsLoading(true);
      const response = await updateUserApi(id, form);
      if (response.status == 200) {
        showSuccessModal(response.data.message, 'Done', () => {
          navigation.goBack();
        });
      }
    } catch (error) {
      if (error.response && error.response.status == 400) {
        if (error.response.data.error == 'nip') {
          setFormError({nip: error.response.data.message});
          setPage('page1');
        } else if (error.response.data.error == 'nik') {
          setFormError({nik: error.response.data.message});
          setPage('page1');
        }
      } else if (error.response && error.response.status == 422) {
        setFormError({file: error.response.data.message});
        setPage('page3');
      } else {
        console.log(error.response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      AmbilData();
    }, []),
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {page === 'page1' && (
              <Page1
                formError={formError}
                onClickNext={handelToPage2}
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {page === 'page2' && (
              <Page2
                formData={formData}
                formError={formError}
                onClickBack={() => setPage('page1')}
                onClickNext={handelToPage3}
                setFormData={setFormData}
              />
            )}

            {page === 'page3' && (
              <Page3
                formData={formData}
                formError={formError}
                setFormData={setFormData}
                onClickBack={() => setPage('page2')}
                onSave={handleSave}
              />
            )}
          </View>
        </ScrollView>
        {isLoading && <LoadingComponent />}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey,
  },
  content: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
});

export default EditScreen;
