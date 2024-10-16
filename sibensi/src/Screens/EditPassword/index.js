import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {COLORS} from '../../Assets';
import {IonIcon, LoadingComponent, ModalSuccess} from '../../Components';
import {getItem} from '../../Utils';
import {useDispatch, useSelector} from 'react-redux';
import {ChangePassword} from '../../Features/userSlice';
import {ChangePasswordAdmin} from '../../Features/authSlice';
import {useModal} from 'react-native-modal-message';

const EditPasswordScreen = ({navigation}) => {
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const dispatch = useDispatch();
  const {isLoading: userLoading} = useSelector(state => state.user);
  const {isLoading: authLoadin} = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    passwordOld: '',
    password: '',
    passwordConfirm: '',
  });
  const [formError, setFormError] = useState({
    passwordOld: '',
    password: '',
    passwordConfirm: '',
  });
  const {showSuccessModal} = useModal();

  const HandleSubmit = async () => {
    switch (true) {
      case formData.passwordOld === '':
        return setFormError({passwordOld: 'Inputan tidak boleh kosong!'});
      case formData.password === '':
        return setFormError({password: 'Inputan tidak boleh kosong!'});
      case formData.passwordConfirm === '':
        return setFormError({passwordConfirm: 'Inputan tidak boleh kosong!'});
      default:
        const profile = await getItem('profile');
        const role = await getItem('role');
        let response;
        switch (role) {
          case 1:
            response = await dispatch(
              ChangePassword({id: profile?.data?.userId, ...formData}),
            );
            break;
          case 2:
            response = await dispatch(
              ChangePasswordAdmin({id: profile?.data?.userId, ...formData}),
            );
        }

        if (response?.payload?.status === 200) {
          showSuccessModal('Password berhasil di ubah!', 'Oke', () => {
            if (role == 1) return navigation.replace('Main');
            if (role == 2) return navigation.replace('MainAdmin');
          });
        } else {
          const {error, message} = response?.payload || {};
          switch (error) {
            case 'passwordOld':
              setFormError({passwordOld: message});
              break;
            case 'password':
              setFormError({password: message});
              break;
            case 'passwordConfirm':
              setFormError({passwordConfirm: message});
              break;
          }
        }
        break;
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={HandleSubmit}>
          <Text style={{color: '#3781fa', fontSize: 16}}>Selesai</Text>
        </TouchableOpacity>
      ),
    });
  }, [HandleSubmit]);
  return (
    <SafeAreaView style={styles.STContainer}>
      <View style={styles.STContent}>
        <View style={styles.STCard}>
          <View style={styles.STContentForm}>
            <Text style={styles.STTextBold}>Password Lama :</Text>
            <View style={styles.STFormInput}>
              <TextInput
                placeholder="Password Lama Anda"
                style={[
                  styles.STForm,
                  formError.passwordOld && {borderColor: COLORS.red},
                ]}
                placeholderTextColor={COLORS.greyOld}
                secureTextEntry={!showPasswordOld}
                value={formData.passwordOld}
                onChangeText={text =>
                  setFormData({...formData, passwordOld: text})
                }
              />
              <TouchableOpacity
                onPress={() => setShowPasswordOld(!showPasswordOld)}
                style={styles.STHiddenPassword}>
                {showPasswordOld ? (
                  <IonIcon name={'eye'} size={22} color={COLORS.black} />
                ) : (
                  <IonIcon name={'eye-off'} size={22} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>
            {formError.passwordOld && (
              <Text style={styles.STTextError}>{formError.passwordOld}</Text>
            )}
          </View>
          <View style={styles.STContentForm}>
            <Text style={styles.STTextBold}>Password :</Text>
            <View style={styles.STFormInput}>
              <TextInput
                placeholder="Password Baru"
                style={[
                  styles.STForm,
                  formError.password && {borderColor: COLORS.red},
                ]}
                placeholderTextColor={COLORS.greyOld}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={text =>
                  setFormData({...formData, password: text})
                }
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.STHiddenPassword}>
                {showPassword ? (
                  <IonIcon name={'eye'} size={22} color={COLORS.black} />
                ) : (
                  <IonIcon name={'eye-off'} size={22} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>
            {formError.password && (
              <Text style={styles.STTextError}>{formError.password}</Text>
            )}
          </View>
          <View style={styles.STContentForm}>
            <Text style={styles.STTextBold}>Confirm Password :</Text>
            <View style={styles.STFormInput}>
              <TextInput
                placeholder="Ketikkan Ulang Password"
                style={[
                  styles.STForm,
                  formError.passwordConfirm && {borderColor: COLORS.red},
                ]}
                placeholderTextColor={COLORS.greyOld}
                secureTextEntry={!showPasswordConfirm}
                value={formData.passwordConfirm}
                onChangeText={text =>
                  setFormData({...formData, passwordConfirm: text})
                }
              />
              <TouchableOpacity
                onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                style={styles.STHiddenPassword}>
                {showPasswordConfirm ? (
                  <IonIcon name={'eye'} size={22} color={COLORS.black} />
                ) : (
                  <IonIcon name={'eye-off'} size={22} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>
            {formError.passwordConfirm && (
              <Text style={styles.STTextError}>
                {formError.passwordConfirm}
              </Text>
            )}
          </View>
        </View>
      </View>
      {userLoading || (authLoadin && <LoadingComponent />)}
    </SafeAreaView>
  );
};

export default EditPasswordScreen;
const styles = StyleSheet.create({
  STContainer: {
    flex: 1,
  },
  STContent: {
    marginHorizontal: 20,
    marginVertical: 20,
    flex: 1,
    justifyContent: 'center',
  },
  STCard: {
    borderWidth: 1,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderColor: COLORS.grey,
    elevation: 2,
  },
  STContentForm: {
    marginVertical: 10,
  },
  STTextBold: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  STFormInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  STForm: {
    fontSize: 16,
    borderWidth: 1,
    paddingLeft: 15,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    width: '100%',
    borderColor: COLORS.grey,
    color: COLORS.black,
  },
  STHiddenPassword: {
    position: 'absolute',
    right: 12,
  },
  STTextError: {
    fontSize: 14,
    color: COLORS.red,
    marginTop: 5,
  },
});
