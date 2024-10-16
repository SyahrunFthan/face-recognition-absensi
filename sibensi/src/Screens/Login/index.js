import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, IlLogoInspektorat} from '../../Assets';
import {IonIcon, LoadingComponent, ModalSuccess} from '../../Components';
import {useDispatch, useSelector} from 'react-redux';
import {LoginAdminApp, LoginApp} from '../../Features/authSlice';
import {setItem} from '../../Utils';
import {Picker} from '@react-native-picker/picker';

const LoginScreen = ({navigation}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 0,
  });
  const [formError, setFormError] = useState({
    username: '',
    password: '',
    role: '',
  });
  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.auth);

  const HandleLogin = async () => {
    if (formData.username === '')
      return setFormError({username: 'Username tidak boleh kosong!'});
    if (formData.password === '')
      return setFormError({password: 'Password tidak boleh kosong!'});
    if (formData.role === 0) return setFormError({role: 'Pilih Akses Anda!'});
    if (formData.role === 1) {
      try {
        const response = await dispatch(LoginApp({...formData}));
        if (response.payload.status === 400) {
          if (response.payload.data.error === 'username')
            return setFormError({username: response.payload.data.message});
          if (response.payload.data.error === 'password')
            return setFormError({password: response.payload.data.message});
        } else {
          await setItem('profile', response.payload.data);
          await setItem('role', 1);
          navigation.replace('Main');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await dispatch(LoginAdminApp({...formData}));
        if (response.payload.status === 400) {
          if (response.payload.data.error === 'username')
            return setFormError({username: response.payload.data.message});
          if (response.payload.data.error === 'password')
            return setFormError({password: response.payload.data.message});
        } else {
          navigation.replace('MainAdmin');
          await setItem('profile', response.payload.data);
          await setItem('role', 2);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentHeader}>
            <Text style={styles.textHeader}>
              Sib<Text style={{color: '#cca457'}}>ensi</Text>
            </Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{gap: 20, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={IlLogoInspektorat}
                style={{width: 140, height: 140}}
              />
              <Text style={styles.textHeader}>Login</Text>
            </View>
            <View style={{flex: 1}}>
              <View style={styles.contentFormInput}>
                <Text style={styles.textLabel}>Username :</Text>
                <View style={styles.formControl}>
                  <TextInput
                    placeholder="Enter your username"
                    placeholderTextColor={COLORS.grey}
                    style={[
                      styles.formInput,
                      formError.username && {borderColor: COLORS.red},
                    ]}
                    maxLength={20}
                    value={formData.username}
                    keyboardType="numeric"
                    onChangeText={text =>
                      setFormData({...formData, username: text})
                    }
                  />
                  <View style={styles.iconForm}>
                    <IonIcon name={'person'} size={20} color={COLORS.grey} />
                  </View>
                </View>
                {formError.username && (
                  <View style={{marginTop: 5}}>
                    <Text style={{color: COLORS.red}}>
                      {formError.username}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.contentFormInput}>
                <Text style={styles.textLabel}>Password :</Text>
                <View style={styles.formControl}>
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.grey}
                    style={[
                      styles.formInput,
                      formError.password && {borderColor: COLORS.red},
                    ]}
                    maxLength={20}
                    keyboardType="ascii-capable"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={text =>
                      setFormData({...formData, password: text})
                    }
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.iconForm}>
                    {showPassword ? (
                      <IonIcon name={'eye'} size={20} color={COLORS.grey} />
                    ) : (
                      <IonIcon name={'eye-off'} size={20} color={COLORS.grey} />
                    )}
                  </TouchableOpacity>
                </View>
                {formError.password && (
                  <View style={{marginTop: 5}}>
                    <Text style={{color: COLORS.red}}>
                      {formError.password}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.contentFormInput}>
                <Text style={styles.textLabel}>Login Sebagai :</Text>
                <View style={styles.formControl}>
                  <View
                    style={[
                      styles.formSelect,
                      formError.role && {borderColor: COLORS.red},
                    ]}>
                    <Picker
                      style={{color: COLORS.grey}}
                      selectedValue={formData.role}
                      onValueChange={(item, index) =>
                        setFormData({...formData, role: item})
                      }>
                      <Picker.Item label="-- Pilih Akses Anda --" value={0} />
                      <Picker.Item label="User" value={1} />
                      <Picker.Item label="Admin" value={2} />
                    </Picker>
                  </View>
                </View>
                {formError.role && (
                  <View style={{marginTop: 5}}>
                    <Text style={{color: COLORS.red}}>{formError.role}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.buttonLogin}
                onPress={HandleLogin}>
                <Text style={styles.textButton}>Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {isLoading && <LoadingComponent />}
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  textHeader: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
  },
  content: {
    marginHorizontal: 20,
    marginVertical: 20,
    flex: 1,
  },
  contentHeader: {
    marginBottom: 30,
  },
  contentBody: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
  },
  body: {
    alignItems: 'center',
    width: 280,
  },
  textBold: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.greyOld,
  },
  textNormal: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '300',
    color: COLORS.greyOld,
  },
  contentFooter: {
    flex: 1,
    borderWidth: 1,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: COLORS.grey,
  },
  textLabel: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: '700',
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  formInput: {
    color: COLORS.black,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    borderColor: COLORS.grey,
    backgroundColor: COLORS.white,
    width: '100%',
    paddingRight: 38,
  },
  iconForm: {
    position: 'absolute',
    right: 12,
  },
  buttonLogin: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2C9BD4',
  },
  textButton: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  contentFormInput: {
    marginVertical: 8,
  },
  formSelect: {
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.grey,
    backgroundColor: COLORS.white,
    width: '100%',
    height: 50,
    justifyContent: 'center',
  },
});
