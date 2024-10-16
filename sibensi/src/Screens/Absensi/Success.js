import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, IlSuccessIconFace} from '../../Assets';
import { useRoute } from '@react-navigation/native';

const SuccessScreen = ({navigation}) => {
  const route = useRoute();
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          marginHorizontal: 20,
          marginVertical: 20,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}>
        <Image source={IlSuccessIconFace} style={{width: 80, height: 80}} />
        <View>
          <Text
            style={{
              color: COLORS.black,
              textAlign: 'center',
              fontSize: 24,
              fontWeight: '400',
            }}>
            Berhasil!
          </Text>
          <Text style={{color: COLORS.greyOld, fontSize: 16}}>
            {route.params.message}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.replace('Main')}
        style={{
          paddingVertical: 8,
          backgroundColor: COLORS.primary,
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 20, color: COLORS.white, fontWeight: '600'}}>
          Go Back Home
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SuccessScreen;
