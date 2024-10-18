import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { COLORS, IlCalenderIcon } from '../../Assets';
import { useCameraDevice } from 'react-native-vision-camera';
import { Defs, Ellipse, Mask, Rect, Svg } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { Camera } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import moment from 'moment-timezone';
import { faceRecognition, getItem, setItem } from '../../Utils';
import { useDispatch } from 'react-redux';
import { GetUserLogin } from '../../Features/userSlice';
import { IonIcon, LoadingComponent } from '../../Components';
import Geolocation from '@react-native-community/geolocation';

const dimensin = Dimensions.get('window');

const AbsensiScreen = ({ navigation }) => {
  const [cameraActive, setCameraActive] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceCame, setFaceCame] = useState(false);
  const [jamAbsen, setJamAbsen] = useState([]);
  const [strokeColor, setStrokeColor] = useState('#fff');
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const device = useCameraDevice('front');
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  const hariAbsen = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
  ];
  const today = moment().tz('Asia/Makassar').format('dddd');
  const jamHariIni = moment().tz('Asia/Makassar').format('HH:mm:ss');

  useFocusEffect(
    React.useCallback(() => {
      setCameraActive(true);

      return () => {
        setCameraActive(false);
      };
    }, []),
  );

  const handleDetectedFaces = Worklets.createRunOnJS((faces) => {
    if (faces.length > 0) {
      const face = faces[0];
      const { x, y, width, height } = face.bounds;

      const frameCenterX = dimensin.width / 2;
      const frameCenterY = dimensin.height / 2;
      const frameRadiusX = 125;
      const frameRadiusY = 170;

      const faceCenterX = x + width / 2;
      const faceCenterY = y + height / 2;

      const isWithinFrame =
        (((faceCenterX - frameCenterX) * 2) / frameRadiusX) * 2 +
        (((faceCenterY - frameCenterY) * 2) / frameRadiusY) * 2 <=
        1;

      const detectionThreshold = 0.7;
      if (
        isWithinFrame &&
        width / frameRadiusX > detectionThreshold &&
        height / frameRadiusY > detectionThreshold
      ) {
        setFaceCame(true);
        setStrokeColor('green');
      } else {
        setFaceCame(false);
        setFaceDetected(false);
        setStrokeColor('#fff');
      }
    } else {
      setFaceCame(false);
      setFaceDetected(false);
      setStrokeColor('#fff');
    }
  });

  const getMimeType = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase(); // Ambil ekstensi file dan pastikan huruf kecil
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    return mimeTypes[extension] || 'application/octet-stream'; // Default jika tidak dikenal
  };
  

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        quality: 85,
        skipMetadata: true,
      });
      if (photo) {
        setFaceDetected(false);
        const mimeTypes = getMimeType(photo.path)
        const profile = await getItem('profile');
        
        if (profile && profile.data && profile.data.userId) {
          let formData = new FormData();
          formData.append('file', {
            uri: `file://${photo.path}`,
            type: mimeTypes,
            name: 'photo.jpg',
          });
          formData.append('userId', profile?.data?.userId);
          formData.append(
            'status',
            jamHariIni > jamAbsen.jam_absen_datang &&
              jamHariIni < jamAbsen.jam_akhir_absen_datang
              ? 1
              : 2,
          );
          formData.append('latitude', latitude);
          formData.append('longitude', longitude);

          try {
            setIsLoading(true);
            const response = await faceRecognition(formData)
            if (response.status == 200) {
              navigation.replace('Success', {message: "Anda berhasil absen!"});
            }
          } catch (error) {
            if (error.response && error.response.status === 400) {
              if(error.response.data.error == 'location') {
                await setItem('status', 1)
                navigation.replace('Pengajuan', {statusAbsensi: jamHariIni > jamAbsen.jam_absen_datang &&
                  jamHariIni < jamAbsen.jam_akhir_absen_datang ? 1 : 2})
              }else{
                navigation.replace('Error', {
                  message: error.response.data.message,
                });
              }
            } else if (error.request) {
              console.error('Request error:', error.request);
            } else {
              console.error('Error', error.message);
            }
          } finally {
            setIsLoading(false);
          }
        } else {
          console.log('Profile or userId is missing.');
        }
      } else {
        console.log('Failed to take photo.');
      }
    } else {
      console.log('Camera reference is not set or frameCame is true.');
    }
  };

  const AmbilData = async () => {
    const profile = await getItem('profile');
    const response = await dispatch(GetUserLogin({ id: profile?.data?.userId }));
    setJamAbsen(response?.payload?.data?.jamAbsen);
  };

  useFocusEffect(
    React.useCallback(() => {
      AmbilData();
      requestPermissionLocation();
    }, []),
  );

  const requestPermissionLocation = async () => {
    try {
      const response = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Perizinan Lokasi!',
          message: 'Aplikasi memerlukan izin untuk mengakses lokasi anda!',
          buttonPositive: 'Ya,Izinkan',
        },
      );
      if (response === 'granted') {
        Geolocation.getCurrentPosition(position => {
          setLatitude(position?.coords?.latitude);
          setLongitude(position?.coords?.longitude);
        });
      }
      if (response === 'denied') return await Linking.openSettings();
    } catch (error) {
      console.log(error);
    }
  };

  if (!cameraActive) {
    return (
      <SafeAreaView style={styles.STContainer}>
        <Text>Tidak Di Izinkan Absensi</Text>
      </SafeAreaView>
    );
  } else {
    if (hariAbsen.includes(today)) {
      if (
        (jamHariIni > jamAbsen.jam_absen_datang &&
          jamHariIni < jamAbsen.jam_akhir_absen_datang) ||
        (jamHariIni > jamAbsen.jam_absen_pulang &&
          jamHariIni < jamAbsen.jam_akhir_absen_pulang)
      ) {
        return (
          <SafeAreaView style={styles.STContainer}>
            {device && (
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={cameraActive}
                ref={cameraRef}
                faceDetectionCallback={
                  faceDetected ? undefined : handleDetectedFaces
                }
                faceDetectionOptions={{
                  windowWidth: dimensin.width / 2,
                  windowHeight: dimensin.height / 2,
                }}
                photo={true}
              />
            )}
            <Svg style={styles.svgContainer}>
              <Defs>
                <Mask id="mask" x={0} y={0} height={'100%'} width={'100%'}>
                  <Rect height={'100%'} width={'100%'} fill={'#fff'} />
                  <Ellipse
                    cx={dimensin.width / 2}
                    cy={dimensin.height / 2}
                    rx={125}
                    ry={170}
                    fill={'black'}
                  />
                </Mask>
              </Defs>
              <Rect
                height={'100%'}
                width={'100%'}
                fill={'rgba(0,0,0,0.8)'}
                mask="url(#mask)"
              />
              <Ellipse
                cx={dimensin.width / 2}
                cy={dimensin.height / 2}
                rx={125}
                ry={170}
                strokeWidth={3}
                stroke={strokeColor}
                fill={'transparent'}
              />
            </Svg>
            {faceCame && (
              <TouchableOpacity style={styles.buttonAbsen} onPress={takePhoto}>
                <IonIcon
                  name={'camera-outline'}
                  size={40}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            )}
            {isLoading && <LoadingComponent />}
          </SafeAreaView>
        );
      } else {
        return (
          <SafeAreaView
            style={[styles.STContainer, { backgroundColor: COLORS.grey }]}>
            <View style={styles.contentNull}>
              <View style={styles.cardContentNull}>
                <Image
                  source={IlCalenderIcon}
                  style={{ width: 150, height: 150 }}
                />
                <Text style={styles.textContentNull}>
                  Tidak Ada Jam Absen Untuk Sekarang!
                </Text>
              </View>
            </View>
          </SafeAreaView>
        );
      }
    } else {
      return (
        <SafeAreaView
          style={[styles.STContainer, { backgroundColor: COLORS.grey }]}>
          <View style={styles.contentNull}>
            <View style={styles.cardContentNull}>
              <Image
                source={IlCalenderIcon}
                style={{ width: 150, height: 150 }}
              />
              <Text style={styles.textContentNull}>Hari Libur Ini!</Text>
            </View>
          </View>
        </SafeAreaView>
      );
    }
  }
};

const styles = StyleSheet.create({
  STContainer: {
    flex: 1,
  },
  svgContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  contentProcess: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
  },
  detectionText: {
    color: 'white',
    fontSize: 20,
  },
  contentNull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cardContentNull: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    width: '100%',
    height: 400,
    backgroundColor: COLORS.white,
    elevation: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContentNull: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    width: 280,
  },
  buttonAbsen: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
  },
});

export default AbsensiScreen;
