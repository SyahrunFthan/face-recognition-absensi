import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../Assets'
import Select from '../../Components/Select'
import { Input, LoadingComponent } from '../../Components'
import { getItem, pengajuanAbsensiApi, removeItem } from '../../Utils'
import {useModal} from 'react-native-modal-message'

const PengajuanScreen = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(false)
    const {showErrorModal, showSuccessModal} = useModal()
    const [formData, setFormData] = useState({
        status: '',
        keterangan: '',
        userId: '',
        statusAbsensi: route.params.statusAbsensi
    })
    const [formError, setFormError] = useState({
        status: '',
        keterangan: ''
    })

    const status = [
        {
          label: '-- Pilih Pengajuan --',
          value: '',
        },
        {
          label: 'Izin',
          value: 'Izin',
        },
        {
          label: 'Sakit',
          value: 'Sakit',
        },
    ];

    const HandleBack = async() => {
        await removeItem('status')
        navigation.replace('Main')
    }

    const getUser = async() => {
        const profile = await getItem('profile')
        setFormData({...formData, userId: profile.data.userId}) 
    }

    const HandleSend = async() => {
        if(formData.status == '') return setFormError({status: 'Pilih jenis pengajuan!'})
            try {
                setIsLoading(true)
                const response = await pengajuanAbsensiApi(formData)
                if(response.status == 201){
                    showSuccessModal('Anda berhasil absen!', 'Oke', async() => {
                        await removeItem('status')
                        navigation.replace('Main')
                    })
                }
            } catch (error) {
                if(error.response && error.response.status == 400){
                    showErrorModal(error.response.data.message, 'Oke',async() => {
                        await removeItem('status')
                        navigation.replace('Main')
                    })
                }
            }finally{
                setIsLoading(false)
            }
    }

    useEffect(() => {
        getUser()
        console.log(formData);
        
    },[])
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <View style={{backgroundColor: COLORS.red, padding: 10, borderRadius: 10}}>
                <Text style={{color: COLORS.white}}>Anda berada di luar lokasi absensi, silahkan ajukan izin atau sakit.</Text>
            </View>
            <View style={{marginTop: 10, gap: 20}}>
                <View style={{gap: 10}}>
                    <Text style={{color: COLORS.black, fontSize: 20, fontWeight: '600'}}>Pilih Pengajuan :</Text>
                    <Select
                        data={status}
                        value={formData.status}
                        onValueChange={value =>
                            setFormData({...formData, status: value})
                        }
                        style={{
                            borderBottomColor: formError.status
                            ? COLORS.red
                            : COLORS.black,
                        }}
                    />
                    {formError.status && (
                        <Text style={{color: COLORS.red}}>{formError.status}</Text>
                    )}
                </View>
                <View style={{gap: 10}}>
                    <Text style={{color: COLORS.black, fontSize: 20, fontWeight: '600'}}>Keterangan: </Text>
                    <Input
                        placeholder={'Keterangan'}
                        value={formData.keterangan}
                        onChangeText={text => setFormData({...formData, keterangan: text})}
                        numberOfLines={4}
                        multiline={true}
                        style={styles.textArea}
                    />
                </View>
                <View style={styles.contentButton}>
                    <TouchableOpacity style={styles.button} onPress={HandleSend}>
                        <Text style={styles.textButton}>Kirim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.red}]} onPress={HandleBack}>
                        <Text style={styles.textButton}>Kembali</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        {isLoading && <LoadingComponent/>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        marginHorizontal: 20,
        marginVertical: 20
    },
    textArea: {
        height: 100,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        textAlignVertical: 'top',
      },
      button: {
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        width: '100%',
      },
      textButton: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: '700',
      },
      contentButton: {
        alignItems: 'center',
        gap: 10,
      },
})

export default PengajuanScreen