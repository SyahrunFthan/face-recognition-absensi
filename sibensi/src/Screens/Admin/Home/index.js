import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  HeaderComponent,
  LoadingComponent,
  MaterialIcon,
} from '../../../Components';
import {GetAdminLogin} from '../../../Features/authSlice';
import {getItem, getUserApi} from '../../../Utils';
import {useFocusEffect} from '@react-navigation/native';
import {COLORS, IlDefault} from '../../../Assets';
import {useModal} from 'react-native-modal-message';
import {DeleteUser} from '../../../Features/userSlice';

const HomeAdminScreen = ({navigation}) => {
  const [profile, setProfile] = useState([]);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.user);
  const {showModalConfirm, showSuccessModal} = useModal();
  const [refresh, setRefresh] = useState(false);

  const AmbilData = async () => {
    try {
      const profile = await getItem('profile');
      const response = await dispatch(
        GetAdminLogin({id: profile?.data?.userId}),
      );
      setProfile(response?.payload?.data?.response);
    } catch (error) {
      console.log(error);
    }
  };

  const GetDataUser = async () => {
    try {
      const response = await getUserApi();
      setData(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  const HandleDelete = id => {
    showModalConfirm(
      'Perhatian!',
      'Anda yakin menghapus user ini?',
      'Batal',
      'Ya, Hapus!',
      async () => {
        try {
          const response = await dispatch(DeleteUser({id: id}));
          if (response.payload.status == 200) {
            showSuccessModal(response.payload.data, 'Done', () => {
              GetDataUser();
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    );
  };

  const HandleEdit = id => {
    // console.log(id);
    navigation.navigate('Edit User', {id: id});
  };

  const refreshControl = () => {
    setRefresh(true);
    AmbilData();
    GetDataUser();
    setRefresh(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      AmbilData();
      GetDataUser();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent profile={profile} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshControl} />
        }>
        <View style={styles.content}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <View style={styles.contentCard} key={index}>
                <View style={styles.card}>
                  <Image
                    source={item.url ? {uri: item.url} : IlDefault}
                    style={styles.image}
                  />
                  <View>
                    <Text style={styles.textBold}>{item.nama}</Text>
                    <Text style={styles.textGrey}>NIP: {item.nip}</Text>
                    <Text style={styles.textGrey}>NIK: {item.nik}</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', gap: 2}}>
                  <TouchableOpacity onPress={() => HandleEdit(item?.id_user)}>
                    <MaterialIcon
                      name={'square-edit-outline'}
                      color={COLORS.success}
                      size={30}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => HandleDelete(item?.id_user)}>
                    <MaterialIcon
                      name={'trash-can-outline'}
                      color={COLORS.red}
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.viewError}>
              <Text
                style={[
                  styles.dateText,
                  {
                    color: COLORS.greyOld,
                    textAlign: 'center',
                    fontStyle: 'italic',
                  },
                ]}>
                Tidak Ada Pengguna!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {isLoading && <LoadingComponent />}
    </SafeAreaView>
  );
};

export default HomeAdminScreen;
const styles = StyleSheet.create({
  viewError: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    gap: 10,
    marginVertical: 20,
  },
  contentCard: {
    borderWidth: 1,
    marginHorizontal: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
    borderRadius: 8,
  },
  card: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  textBold: {
    color: COLORS.black,
    fontWeight: '700',
    fontSize: 16,
    width: 180,
  },
  textGrey: {
    color: COLORS.greyOld,
    fontWeight: '700',
    width: 180,
  },
  dateText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderColor: COLORS.primary,
    borderWidth: 1,
    objectFit: 'cover',
  },
});
