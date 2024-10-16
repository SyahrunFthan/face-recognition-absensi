import {View, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, IlDefault} from '../../Assets';
import {useDispatch, useSelector} from 'react-redux';
import {getItem} from '../../Utils';
import {GetUserLogin} from '../../Features/userSlice';
import {
  CardProfileComponent,
  DataProfileComponent,
  LoadingComponent,
} from '../../Components';
import {GetAdminLogin} from '../../Features/authSlice';
import moment from 'moment';

const DetailProfileScreen = () => {
  const [profile, setProfile] = useState([]);
  const dispatch = useDispatch();
  const {isLoading: userLoading} = useSelector(state => state.user);
  const {isLoading: authLoading} = useSelector(state => state.auth);

  const AmbilData = async () => {
    const profile = await getItem('profile');
    const role = await getItem('role');
    if (role == 1) {
      const response = await dispatch(
        GetUserLogin({id: profile?.data?.userId}),
      );
      setProfile(response?.payload?.data?.response);
    } else {
      const response = await dispatch(
        GetAdminLogin({id: profile?.data?.userId}),
      );
      setProfile(response?.payload?.data?.response);
    }
  };

  useEffect(() => {
    AmbilData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentHeader}>
        <CardProfileComponent
          image={profile?.url ? {uri: profile?.url} : IlDefault}
          name={profile?.nama}
          nip={profile?.nip}
        />
      </View>
      <View style={styles.contentBody}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DataProfileComponent value={profile?.nama} />
          <DataProfileComponent value={profile?.nip} />
          <DataProfileComponent value={profile?.nik} />
          <DataProfileComponent value={profile?.jabatan} />
          <DataProfileComponent
            value={moment(profile?.tanggal_lahir).format('DD MMMM YYYY')}
          />
          <DataProfileComponent value={profile?.telpon} />
          <DataProfileComponent value={profile?.agama} />
          <DataProfileComponent value={profile?.status_nikah} />
          <DataProfileComponent
            value={profile?.jenis_kelamin == 'L' ? 'Laki-Laki' : 'Perempuan'}
          />
        </ScrollView>
      </View>
      {userLoading || (authLoading && <LoadingComponent />)}
    </SafeAreaView>
  );
};

export default DetailProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentHeader: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  contentBody: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: -20,
  },
});
