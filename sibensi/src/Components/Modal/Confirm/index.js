import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS} from '../../../Assets';
import IonIcon from '../../IonIcon';

const ModalConfirm = ({
  isVisible,
  buttonBack,
  buttonAction,
  textConfirm,
  textSave,
  textHeader,
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <IonIcon
              name={'alert-circle-outline'}
              size={24}
              color={COLORS.white}
            />
            <Text style={styles.textBold}>{textHeader}</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.textNormal}>{textConfirm}</Text>
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={buttonBack}>
              <Text style={{fontSize: 16, color: COLORS.grey}}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={buttonAction}>
              <Text style={{fontSize: 16, color: COLORS.red}}>{textSave}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.transparent,
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalHeader: {
    padding: 10,
    backgroundColor: COLORS.red,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
  },
  textBold: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  modalBody: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  textNormal: {
    color: COLORS.greyOld,
    fontSize: 16,
    fontWeight: '400',
  },
  modalFooter: {
    marginBottom: 10,
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
    marginHorizontal: 10,
  },
});

export default ModalConfirm;
