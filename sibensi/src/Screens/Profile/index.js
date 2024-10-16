import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, IlDefault } from '../../Assets';
import {
  CardProfileComponent,
  LoadingComponent,
  MaterialIcon,
  ModalConfirm,
} from '../../Components';
import { getItem, removeItem, removeTokenApi } from '../../Utils';
import { useDispatch, useSelector } from 'react-redux';
import { GetUserLogin } from '../../Features/userSlice';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState([]);
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.user);

  const HandleLogout = () => {
    setVisible(!visible);
  };

  const HandleAction = async () => {
    try {
      const profile = await getItem('profile');
      const response = await removeTokenApi(profile?.data?.userId);
      if (response?.status === 200) {
        await removeItem('profile');
        await removeItem('role');
        navigation.replace('Splash');
        setVisible(!visible);
      }
    } catch (error) {
      console.log(error?.response);
    }
  };

  const AmbilData = async () => {
    setRefreshing(false);
    try {
      const profile = await getItem('profile');
      const response = await dispatch(
        GetUserLogin({ id: profile?.data?.userId }),
      );
      setProfile(response?.payload?.data?.response);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      AmbilData();
    }, []),
  );

  const HandleRefresh = () => {
    setRefreshing(true);
    AmbilData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={HandleRefresh} />
        }>
        <View style={styles.content}>
          <CardProfileComponent
            name={profile?.nama}
            image={profile?.url ? { uri: profile?.url } : IlDefault}
            nip={profile?.nip}
          />
          <View style={styles.contentBody}>
            <TouchableOpacity
              style={styles.contentButton}
              onPress={() => navigation.navigate('Detail')}>
              <View style={styles.contentButtonLeft}>
                <MaterialIcon
                  name={'account-circle'}
                  size={33}
                  color={'#505dd3'}
                />
              </View>
              <View style={styles.contentButtonCenter}>
                <Text style={[styles.textNormal, { color: '#505dd3' }]}>
                  Data Profile
                </Text>
              </View>
              <View style={styles.contentButtonRight}>
                <MaterialIcon
                  name={'arrow-right'}
                  color={'#505dd3'}
                  size={24}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contentButton}
              onPress={() => navigation.navigate('Password')}>
              <View style={styles.contentButtonLeft}>
                <MaterialIcon
                  name={'lock-open-outline'}
                  size={33}
                  color={'#505dd3'}
                />
              </View>
              <View style={styles.contentButtonCenter}>
                <Text style={[styles.textNormal, { color: '#505dd3' }]}>
                  Edit Password
                </Text>
              </View>
              <View style={styles.contentButtonRight}>
                <MaterialIcon
                  name={'arrow-right'}
                  color={'#505dd3'}
                  size={24}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('FaceRegistration')}
              style={styles.contentButton}>
              <View style={styles.contentButtonLeft}>
                <MaterialIcon
                  name={'face-recognition'}
                  size={33}
                  color={'#505dd3'}
                />
              </View>
              <View style={styles.contentButtonCenter}>
                <Text style={[styles.textNormal, { color: '#505dd3' }]}>
                  Perekaman Wajah
                </Text>
              </View>
              <View style={styles.contentButtonRight}>
                <MaterialIcon
                  name={'arrow-right'}
                  color={'#505dd3'}
                  size={24}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={HandleLogout}
              style={styles.contentButton}>
              <View style={styles.contentButtonLeft}>
                <MaterialIcon name={'logout'} size={33} color={'#505dd3'} />
              </View>
              <View style={[styles.contentButtonCenter, { width: '85%' }]}>
                <Text style={[styles.textNormal, { color: '#505dd3' }]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {isLoading && <LoadingComponent />}
      {visible && (
        <ModalConfirm
          buttonAction={HandleAction}
          textSave={'Ya, Keluar'}
          textHeader={'Perhatian!'}
          textConfirm={'Anda akan keluar aplikasi?'}
          isVisible={visible}
          buttonBack={() => setVisible(!visible)}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    marginHorizontal: 12,
    marginVertical: 20,
    flex: 1,
  },
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
  contentBody: {
    flex: 1,
    padding: 10,
  },
  contentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  contentButtonLeft: {
    width: '15%',
    alignItems: 'center',
  },
  contentButtonCenter: {
    width: '70%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  contentButtonRight: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
