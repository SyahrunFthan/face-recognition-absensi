import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS, IlDefault, IlLogoInspektorat} from '../../../Assets';

const HeaderComponent = ({profile}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Image source={IlLogoInspektorat} style={styles.logo} />
        <Text style={styles.headerTitle}>
          Sib<Text style={styles.headerTitleAccent}>ensi</Text>
        </Text>
      </View>
      <View style={styles.welcomeSection}>
        <Image
          source={profile?.url ? {uri: profile?.url} : IlDefault}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.welcomeText}>Selamat Datang!</Text>
          <Text style={styles.username}>{profile?.nama}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default HeaderComponent;
