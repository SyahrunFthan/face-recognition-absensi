import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getItem} from '../../Utils';
import {GetAbsensiById} from '../../Features/absensiSlice';
import {useFocusEffect} from '@react-navigation/native';
import {COLORS, IlDefault} from '../../Assets';
import moment from 'moment';

const RiwayatScreen = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.absensi);
  const [refreshing, setRefreshing] = useState(false);

  const AmbilData = async () => {
    setRefreshing(false);
    const profile = await getItem('profile');
    const response = await dispatch(
      GetAbsensiById({id: profile?.data?.userId}),
    );
    setData(response?.payload?.data?.response);
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
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={HandleRefresh} />
        }>
        <View style={styles.content}>
          {data.length > 0 ? (
            <View style={{gap: 10}}>
              <Text
                style={{
                  fontSize: 24,
                  color: COLORS.black,
                  fontWeight: '600',
                }}>
                Bulan Ini
              </Text>
              {data.map((item, index) => (
                <View style={styles.contentCard} key={index}>
                  <Image
                    source={
                      item?.user?.url ? {uri: item?.user?.url} : IlDefault
                    }
                    style={styles.image}
                  />
                  <View>
                    <Text style={styles.textBold}>{item?.user?.nama}</Text>
                    <Text style={styles.textNormal}>
                      {moment(item?.tanggal_absensi, 'YYYY-MM-DD').format(
                        'dddd, DD MMMM YYYY',
                      )}
                    </Text>
                    <Text style={styles.textNormal}>
                      Status: {item?.status_kehadiran}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={[
                  styles.textBold,
                  {fontStyle: 'italic', fontSize: 24, color: COLORS.greyOld},
                ]}>
                Belum Ada Riwayat Kehadiran!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RiwayatScreen;
const styles = StyleSheet.create({
  content: {
    marginHorizontal: 10,
    marginVertical: 20,
    gap: 10,
  },
  contentCard: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.grey,
    borderColor: COLORS.greyOld,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
  },
  textNormal: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '500',
  },
  textBold: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '700',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    objectFit: 'cover',
  },
});
