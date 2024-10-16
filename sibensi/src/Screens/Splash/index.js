import { SafeAreaView, Image, Linking, Text, Button } from 'react-native';
import React, { useEffect } from 'react';
import { COLORS, IlLogoInspektorat } from '../../Assets';
import { getItem, removeTokenApi } from '../../Utils';
import { jwtDecode } from 'jwt-decode';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';

const SplashScreen = ({ navigation }) => {
  const AmbilData = async () => {
    const response = await getItem('profile');
    const role = await getItem('role')
    setTimeout(async () => {
      if (response) {
        const decode = jwtDecode(response?.token);
        const currentDate = new Date();
        if (decode.exp * 1000 < currentDate.getTime()) {
          const res = await removeTokenApi(decode.userId);
          if (res.status === 200) {
            navigation.replace('Login');
          }
        } else {
          if (role === 1) {
            const status = await getItem('status')
            if(status == 1){
              navigation.replace('Pengajuan');
            }else{
              navigation.replace('Main');
            }
          } else {
            navigation.replace('MainAdmin');
          }
        }
      } else {
        navigation.replace('Login');
      }
    }, 1500);
  };

  const requestPermission = async () => {
    try {
      const response = requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
      ]);

      if (response === RESULTS.GRANTED) return null;
      if (response === RESULTS.DENIED) return Linking.openSettings();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    AmbilData();
    requestPermission();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={IlLogoInspektorat} style={{ width: 200, height: 200 }} />
      <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 28 }}>
        Sib<Text style={{ color: '#cca457' }}>ensi</Text>
      </Text>
    </SafeAreaView>
  );
};

export default SplashScreen;
