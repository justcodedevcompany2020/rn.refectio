import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  View,
  Dimensions,
} from 'react-native';
import BlueButton from '../../Component/Buttons/BlueButton';

const iconWidth = Dimensions.get('window').width / 5;

export default function IconsPage({navigation}) {
  const [iconsArray, setIconsArray] = useState([]);

  const getAllIcons = async () => {
    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`https://admin.refectio.ru/public/api/GetSomePhoto`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // this.setState({iconsArray: result.data});
        setIconsArray(result.data);
      })
      .catch(err => console.log(err, 'error'));
  };

  useEffect(() => {
    getAllIcons();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/image/blurBg.png')}
        style={styles.modalBlurBg}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Выберите аватар заказчика</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={require('../../../assets/image/ixs.png')}
              style={{width: 22.5, height: 22.5}}
            />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.iconParent}>
                {iconsArray.map((icon, index) => {
                  return (
                    <View key={index}>
                      <TouchableOpacity
                        style={[
                          styles.iconItems,
                          {
                            width: iconWidth,
                            height: iconWidth,
                          },
                        ]}
                        onPress={() => {}}>
                        <Image
                          source={{
                            uri: `https://admin.refectio.ru/public/uploads/UnicodeIcon/${icon.photo}`,
                          }}
                          style={{width: 72.77, height: 62.78, zIndex: 1}}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            // onPress={() => this.setState({iconsModal: false})}
          >
            <BlueButton name="Сохранить" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    // paddingHorizontal: 15,
  },
  NameBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 18,
    position: 'relative',
    justifyContent: 'center',
  },
  goBack: {
    position: 'absolute',
    left: -10,
    top: 0,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_500Medium',
    color: '#52A8EF',
  },
  nazvania: {
    borderWidth: 1,
    borderColor: '#F5F5F5',
    padding: 10,
    width: '100%',
    borderRadius: 5,
  },
  nazvaniaText: {
    fontFamily: 'Poppins_500Medium',
    lineHeight: 23,
    fontSize: 15,
    marginTop: 27,
    marginBottom: 5,
  },
  selectButton: {
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderRadius: 5,
    position: 'relative',
  },
  selectedText: {
    padding: 5,
    width: '100%',
    borderRadius: 5,
    color: '#5B5B5B',
  },
  changedCustomersTitleBox: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 24,
    color: '#52A8EF',
    alignSelf: 'center',
    marginTop: 30,
  },
  OpenCityDropDown: {
    width: '100%',
    height: 0,
    zIndex: 100,
  },
  OpenCityDropDownActive: {
    width: '100%',
    height: 120,
    elevation: 2,
    borderColor: '#F5F5F5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 100,
    backgroundColor: '#fff',
  },
  customersParentContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  userIndex: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    padding: 8,
    marginBottom: 11,
    justifyContent: 'space-between',
  },
  userLogo: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  customerName: {
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 5,
    textAlign: 'center',
    fontSize: 15,
    color: '#333333',
  },
  takeItButton: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 7,
  },
  takeItText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  nextPage: {
    marginTop: 60,
    alignSelf: 'center',
    marginBottom: 67,
  },
  modalBlurBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    position: 'relative',
  },
  modalTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 29,
    color: '#333333',
  },
  closeButton: {
    position: 'absolute',
    right: 18,
    top: 18,
  },
  iconContainer: {
    width: '85%',
    alignSelf: 'center',
    height: '65%',
  },
  iconParent: {
    // justifyContent: "space-between",
    columnGap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconItems: {
    width: 88,
    height: 88,
    borderRadius: 15,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 14,
    marginHorizontal: '2%',
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    alignSelf: 'center',
    marginTop: 55,
    // marginBottom: 50
  },
});
