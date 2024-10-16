import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {COLORS, IlErrorIcon} from '../../../Assets';

const ModalError = ({isVisible, onClick, text}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={{alignItems: 'center'}}>
            <View style={styles.modalHeader}>
              <Image source={IlErrorIcon} style={styles.icon} />
            </View>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.textBold}>Error!</Text>
            <Text style={styles.textNormal}>{text}</Text>
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={onClick} style={styles.button}>
              <Text style={styles.textButton}>Oke</Text>
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
    backgroundColor: COLORS.white,
    width: 300,
    height: 320,
    borderRadius: 12,
  },
  modalHeader: {
    width: 80,
    height: 80,
    marginTop: -40,
  },
  modalBody: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalFooter: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
  },
  textBold: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.red,
  },
  textNormal: {
    fontSize: 18,
    color: COLORS.red,
    fontWeight: '300',
  },
  button: {
    paddingHorizontal: 80,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: COLORS.red,
  },
  textButton: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default ModalError;
