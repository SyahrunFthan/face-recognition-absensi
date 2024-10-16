import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  AbsensiScreen,
  DetailProfileScreen,
  EditPasswordScreen,
  EditScreen,
  ErrorScreen,
  FaceRegistrationScreen,
  HomeAdminScreen,
  HomeScreen,
  KehadiranAdminScreen,
  LoginScreen,
  ProfileAdminScreen,
  ProfileScreen,
  RiwayatScreen,
  SettingScreen,
  SplashScreen,
  UserAdminScreen,
} from '../Screens';
import {COLORS} from '../Assets';
import {MaterialIcon} from '../Components';
import SuccessScreen from '../Screens/Absensi/Success';
import {TouchableOpacity} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size, color}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home-account' : 'home-account';
            size = focused ? size + 10 : size + 3;
          } else if (route.name === 'Absensi') {
            iconName = focused ? 'face-recognition' : 'face-recognition';
            size = focused ? size + 7 : size + 3;
          } else if (route.name === 'Riwayat') {
            iconName = focused ? 'history' : 'history';
            size = focused ? size + 7 : size + 3;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle';
            size = focused ? size + 7 : size + 3;
          }

          return <MaterialIcon name={iconName} size={size} color={color} />;
        },
        tabBarInactiveTintColor: COLORS.grey,
        tabBarActiveTintColor: COLORS.primary,
        tabBarLabelStyle: {
          paddingBottom: 3,
          fontSize: 14,
        },
        tabBarStyle: {
          padding: 2,
          height: 60,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false, title: 'Beranda'}}
      />
      <Tab.Screen
        name="Absensi"
        component={AbsensiScreen}
        options={{title: 'Presensi', headerShown: false}}
      />
      <Tab.Screen
        name="Riwayat"
        component={RiwayatScreen}
        options={{
          headerStyle: {backgroundColor: COLORS.primary},
          headerTitleStyle: {color: COLORS.white},
          headerTitle: 'Riwayat Kehadiran',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerStyle: {backgroundColor: COLORS.primary},
          headerTitleStyle: {color: COLORS.white},
        }}
      />
    </Tab.Navigator>
  );
};

const MainAdmin = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size, color}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home-account' : 'home-account';
            size = focused ? size + 10 : size + 3;
          } else if (route.name === 'Pegawai') {
            iconName = focused ? 'account-plus' : 'account-plus';
            size = focused ? size + 7 : size + 3;
          } else if (route.name === 'Kehadiran') {
            iconName = focused
              ? 'text-box-search-outline'
              : 'text-box-search-outline';
            size = focused ? size + 7 : size + 3;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle';
            size = focused ? size + 7 : size + 3;
          }

          return <MaterialIcon name={iconName} size={size} color={color} />;
        },
        tabBarInactiveTintColor: COLORS.grey,
        tabBarActiveTintColor: COLORS.primary,
        tabBarLabelStyle: {
          paddingBottom: 3,
          fontSize: 14,
        },
        tabBarStyle: {
          padding: 2,
          height: 60,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeAdminScreen}
        options={{headerShown: false, title: 'Beranda'}}
      />
      <Tab.Screen
        name="Pegawai"
        component={UserAdminScreen}
        options={{
          title: 'Pegawai',
          headerShown: true,
          headerTitle: 'Tambah Pengguna',
          headerStyle: {backgroundColor: COLORS.primary},
          headerTitleStyle: {color: COLORS.white},
        }}
      />
      <Tab.Screen
        name="Kehadiran"
        component={KehadiranAdminScreen}
        options={{
          headerStyle: {backgroundColor: COLORS.primary},
          headerTitleStyle: {color: COLORS.white},
          headerTitle: 'List Kehadiran Pegawai',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileAdminScreen}
        options={{
          headerStyle: {backgroundColor: COLORS.primary},
          headerTitleStyle: {color: COLORS.white},
        }}
      />
    </Tab.Navigator>
  );
};

const Routes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          statusBarColor: COLORS.primary,
          statusBarStyle: 'light',
          contentStyle: {
            backgroundColor: COLORS.primary,
          },
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Main"
        component={Main}
        options={{statusBarColor: COLORS.primary, statusBarStyle: 'light'}}
      />
      <Stack.Screen
        name="MainAdmin"
        component={MainAdmin}
        options={{statusBarColor: COLORS.primary, statusBarStyle: 'light'}}
      />
      <Stack.Screen
        name="FaceRegistration"
        component={FaceRegistrationScreen}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerShown: true,
          headerTitle: 'Pengaturan',
          statusBarStyle: 'light',
          statusBarColor: COLORS.primary,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen
        name="Error"
        component={ErrorScreen}
        options={{
          headerShown: false,
          statusBarColor: COLORS.white,
          statusBarStyle: 'dark',
          contentStyle: {
            backgroundColor: COLORS.white,
          },
        }}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{
          headerShown: false,
          statusBarColor: COLORS.white,
          statusBarStyle: 'dark',
          contentStyle: {
            backgroundColor: COLORS.white,
          },
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailProfileScreen}
        options={{
          headerShown: true,
          headerTitle: 'Data Pribadi Anda',
          statusBarStyle: 'light',
          statusBarColor: COLORS.primary,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerTintColor: COLORS.white,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Password"
        component={EditPasswordScreen}
        options={{
          headerShown: true,
          headerTitle: 'Edit Password',
          statusBarStyle: 'light',
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerTintColor: COLORS.black,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Edit User"
        component={EditScreen}
        options={{
          headerShown: true,
          headerTitle: 'Edit User',
          headerStyle: {backgroundColor: COLORS.primary},
          headerTitleStyle: {color: COLORS.white},
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
};

export default Routes;
