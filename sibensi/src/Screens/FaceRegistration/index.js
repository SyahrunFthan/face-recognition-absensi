import { SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import { useCameraDevice } from 'react-native-vision-camera';
import { Defs, Ellipse, Mask, Rect, Svg } from 'react-native-svg';
import { Face, Camera } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import { getItem, postFaceUser } from '../../Utils';
import { SuccessComponent } from '../../Components';

const dimension = Dimensions.get('window');

const FaceRegistrationScreen = ({ navigation }) => {
  const [cameraActive, setCameraActive] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#fff');
  const [lastScanTime, setLastScanTime] = useState(null);
  const device = useCameraDevice('front');
  const cameraRef = useRef(null);

  const handleDetectedFaces = Worklets.createRunOnJS((faces) => {
    if (faces.length > 0) {
      if (lastScanTime && Date.now() - lastScanTime < 2000) {
        return;
      }
      setLastScanTime(Date.now());
      const face = faces[0];
      const { x, y, width, height } = face.bounds;

      const frameCenterX = dimension.width / 2;
      const frameCenterY = dimension.height / 2;
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
        setStrokeColor('green');

        takePhoto();
      } else {
        setFaceDetected(false);
        setStrokeColor('#fff');
      }
    } else {
      setFaceDetected(false);
      setStrokeColor('#fff');
    }
  });

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        quality: 85,
        skipMetadata: true,
      });
      if (photo) {
        setFaceDetected(false);
        setCameraActive(false);
        const profile = await getItem('profile');

        if (profile && profile.data && profile.data.userId) {
          let formData = new FormData();
          formData.append('file', {
            uri: `file://${photo.path}`,
            type: 'image/jpeg',
            name: 'photo.jpg',
          });

          try {
            const response = await postFaceUser(
              profile?.data?.userId,
              formData,
            );
            if (response?.status == 201) {
              return null;
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('Profile or userId is missing.');
        }
      } else {
        console.log('Failed to take photo.');
      }
      console.log(photo);
    } else {
      console.log('Camera reference is not set or frameCame is true.');
    }
  };

  if (!cameraActive) {
    return <SuccessComponent onBack={() => navigation.replace('Main')} />;
  } else {
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
              windowWidth: dimension.width / 2,
              windowHeight: dimension.height / 2,
            }}
            photo={cameraActive}
          />
        )}
        <Svg style={styles.svgContainer}>
          <Defs>
            <Mask id="mask" x={0} y={0} height={'100%'} width={'100%'}>
              <Rect height={'100%'} width={'100%'} fill={'#fff'} />
              <Ellipse
                cx={dimension.width / 2}
                cy={dimension.height / 2}
                rx={125}
                ry={170}
                fill={'black'}
              />
            </Mask>
          </Defs>
          <Rect
            height={'100%'}
            width={'100%'}
            fill={'rgba(0,0,0,0.2)'}
            mask="url(#mask)"
          />
          <Ellipse
            cx={dimension.width / 2}
            cy={dimension.height / 2}
            rx={125}
            ry={170}
            strokeWidth={4}
            stroke={strokeColor}
            fill={'transparent'}
          />
        </Svg>
      </SafeAreaView>
    );
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
  detectionText: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    color: 'white',
    fontSize: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  progressBar: {
    height: 5,
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default FaceRegistrationScreen;
