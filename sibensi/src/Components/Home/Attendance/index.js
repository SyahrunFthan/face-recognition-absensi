import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import React from 'react';
import {COLORS, IlDefault} from '../../../Assets';

const AttendanceComponent = ({attendance, refreshing, refreshControl}) => {
  return (
    <View style={styles.contentCard}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshControl} />
        }>
        <View style={{gap: 10}}>
          {attendance.length > 0 ? (
            attendance.map((item, index) => (
              <View style={styles.cardAbsensi} key={index}>
                <Image
                  source={item?.user?.url ? {uri: item?.user?.url} : IlDefault}
                  style={styles.profileImage}
                />
                <View>
                  <Text
                    style={[
                      styles.username,
                      {color: COLORS.black, fontWeight: '700'},
                    ]}>
                    {item?.user?.nama}
                  </Text>
                  <Text
                    style={[
                      styles.username,
                      {color: COLORS.black, fontWeight: '400', fontSize: 16},
                    ]}>
                    Pukul: {item?.jam_absensi} WITA
                  </Text>
                  <Text
                    style={[
                      styles.username,
                      {color: COLORS.black, fontWeight: '400', fontSize: 16},
                    ]}>
                    Status: {item?.status_kehadiran}
                  </Text>
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
                Belum Ada Karyawan Hadir!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceComponent;
const styles = StyleSheet.create({
  viewError: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
  },
  headerContent: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: '700',
  },
  headerTitleAccent: {
    color: '#cca457',
  },
  welcomeSection: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 25,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  profileImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: COLORS.primary,
    objectFit: 'cover',
  },
  welcomeText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    color: COLORS.white,
    fontSize: 20,
  },
  gradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  statsContainer: {
    borderColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
  },
  statCard: {
    width: 81,
    height: 78,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  dateSection: {
    marginTop: 30,
    alignItems: 'center',
    gap: 2,
    flexDirection: 'row',
  },
  dateText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },
  textWhiteBold: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  buttonCheck: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 30,
    padding: 2,
    alignItems: 'center',
  },
  textButton: {
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cardAbsensi: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
  },
  contentCard: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
