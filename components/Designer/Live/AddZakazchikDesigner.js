import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import shuffle from '../../search/shuffle';
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
import Svg, {Path, Rect} from 'react-native-svg';
import ArrowGrayComponent from '../../../assets/image/ArrowGray';
import BlueButton from '../../Component/Buttons/BlueButton';
import DesignerPageNavComponent from '../DesignerPageNav';
import Loading from '../../Component/Loading';
const iconWidth = Dimensions.get('window').width / 5;
import FastImage from 'react-native-fast-image';

export default class AddZakazchikDesignerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityItems: [],
      keyboardOpen: false,
      iconsModal: false,
      iconItems: false,
      OpenCityDropDown: false,
      OpenCityDropDown_error: false,
      manufacture_get: [],
      changed_city: '',
      changed_city_error: false,
      city_id_l: '',
      surname: '',
      surname_error: false,
      name: '',
      name_error: false,
      photo: '',
      photo_error: false,
      proizvoditel_id: [],
      iconsArray: [],
      isLoading: false,
      searchUser: '',
    };
    this.ref = React.createRef();
  }

  enterCheckBox = items => {
    let filterSort = this.state.proizvoditel_id;

    let find = false;
    filterSort.find(item => {
      if (item == items.id) {
        find = true;
      }
    });

    if (find) {
      const index = filterSort.indexOf(items.id);
      filterSort.splice(index, 1);
    } else {
      filterSort.push(items.id);
    }
    this.setState({proizvoditel_id: filterSort});
  };

  verifyCheckBox = id => {
    let filterSort = this.state.proizvoditel_id;
    let find = false;
    filterSort.find(item => {
      if (item == id) {
        find = true;
      }
    });
    return find;
  };

  getCityApi = async () => {
    if (this.state.changed_city !== '') {
      this.setState({changed_city_error: false});
    }

    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    if (!this.state.OpenCityDropDown) {
      await fetch(
        `https://admin.refectio.ru/public/api/getCityApi`,
        requestOptions,
      )
        .then(response => response.json())
        .then(res => {
          if (res.status === true) {
            this.setState({OpenCityDropDown: true});
          }
          this.setState({cityItems: res.data.city});
        });
    } else {
      this.setState({OpenCityDropDown: false, OpenCityDropDown_error: true});
    }
  };

  getManufacturerChangeCity = async (city, searchUser) => {
    console.log(city, 'searchuser');
    await this.setState({changed_city: city.name});
    if (this.state.changed_city === '') {
      this.setState({changed_city_error: true});
    } else {
      this.setState({changed_city_error: false});
    }
    let token = await AsyncStorage.getItem('userToken');

    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);

    let formdata = new FormData();
    formdata.append('city_id', city.id);
    formdata.append('search', searchUser.length > 0 ? searchUser : '');
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`https://admin.refectio.ru/public/api/manufactur-get`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        if (result.status === true) {
          this.setState({
            manufacture_get: shuffle(result.data),
            OpenCityDropDown: false,
          });
        }
      })
      .catch(error => console.log('error', error));
  };
  createNewCustomer = async () => {
    this.setState({isLoading: true});
    let token = await AsyncStorage.getItem('userToken');

    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);

    let form_data = new FormData();

    for (let i = 0; i < this.state.proizvoditel_id.length; i++) {
      form_data.append('proizvoditel_id[]', this.state.proizvoditel_id[i]);
    }

    form_data.append('name', this.state.name);
    form_data.append('surname', this.state.surname);
    form_data.append('photo', this.state.photo);
    form_data.append('city_id', this.state.city_id_l.id);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: form_data,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/manufactur-geter`,
      requestOptions,
    )
      .then(response => response.json())
      .then(async result => {
        if (result.status === true) {
          await this.props.navigation.navigate('ZakaziLiveDesigner');
          await this.clearAllData();
        } else {
          if (result.hasOwnProperty('name')) {
            this.setState({name_error: true});
          } else {
            this.setState({name_error: false});
          }
          if (result.hasOwnProperty('surname')) {
            this.setState({surname_error: true});
          } else {
            this.setState({surname_error: false});
          }
          if (result.hasOwnProperty('photo')) {
            this.setState({photo_error: true});
            this.ref.current.scrollTo({x: 0, y: 0, animated: true});
          } else {
            this.setState({photo_error: false});
          }
          if (result.hasOwnProperty('proizvoditel_id')) {
            this.setState({changed_city_error: true});
          } else {
            this.setState({changed_city_error: false});
          }
        }
        this.setState({isLoading: false});
      })
      .catch(error => console.log('error', error));
  };

  getAllIcons = async () => {
    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`https://admin.refectio.ru/public/api/GetSomePhoto`, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.setState({iconsArray: result.data});
      })
      .catch(err => console.log(err, 'error'));
  };

  componentDidMount() {
    const {navigation} = this.props;
    this.getAllIcons();
    this.focusListener = navigation.addListener('focus', () => {});

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener();
    }
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = event => {
    this.setState({
      keyboardOpen: true,
    });
  };

  _keyboardDidHide = event => {
    this.setState({
      keyboardOpen: false,
    });
  };

  clearAllData = async () => {
    await this.setState({
      cityItems: [],
      keyboardOpen: false,
      iconsModal: false,
      iconItems: false,
      OpenCityDropDown: false,
      OpenCityDropDown_error: false,
      manufacture_get: [],
      changed_city: '',
      changed_city_error: false,

      surname: '',
      surname_error: false,
      name: '',
      name_error: false,
      photo: '',
      photo_error: false,
      proizvoditel_id: [],
      iconsArray: [],
    });
  };

  render() {
    if (this.state.iconsModal == true) {
      return (
        <Modal visible={this.state.iconsModal}>
          <ImageBackground
            source={require('../../../assets/image/blurBg.png')}
            style={styles.modalBlurBg}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Выберите аватар заказчика</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  this.setState({
                    iconsModal: false,
                    iconItems: false,
                    photo: '',
                  });
                }}>
                <Image
                  source={require('../../../assets/image/ixs.png')}
                  style={{width: 22.5, height: 22.5}}
                />
              </TouchableOpacity>

              <View style={styles.iconContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.iconParent}>
                    {this.state.iconsArray.map((icon, index) => {
                      return (
                        <View key={index}>
                          <TouchableOpacity
                            style={[
                              styles.iconItems,
                              {
                                width: iconWidth,
                                height: iconWidth,
                              },
                              this.state.iconItems === index
                                ? {backgroundColor: '#52A8EF'}
                                : {backgroundColor: '#F5F5F5'},
                            ]}
                            onPress={() => {
                              this.setState({
                                iconItems: index,
                                photo: icon.photo,
                              });
                            }}>
                            <Image
                              source={{
                                uri: `https://admin.refectio.ru/public/uploads/UnicodeIcon/${icon.photo}`,
                              }}
                              style={{width: 72.77, height: 62.78, zIndex: 1}}
                              resizeMode={'contain'}
                            />
                          </TouchableOpacity>
                          {this.state.iconsArray.length - 1 == index && (
                            <View></View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => this.setState({iconsModal: false})}>
                <BlueButton name="Сохранить" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </Modal>
      );
    } else {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <>
              <View style={styles.NameBack}>
                <TouchableOpacity
                  style={styles.goBack}
                  onPress={() => {
                    this.props.navigation.navigate('ZakaziLiveDesigner');
                    this.clearAllData();
                  }}>
                  <ArrowGrayComponent />
                </TouchableOpacity>

                <Text style={styles.pageTitle}>Новый заказчик</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} ref={this.ref}>
                <TouchableOpacity
                  style={styles.iconItems}
                  onPress={() => {
                    this.getAllIcons();
                    this.setState({iconsModal: true});
                  }}>
                  {this.state.photo !== '' ? (
                    <Image
                      source={{
                        uri:
                          `https://admin.refectio.ru/public/uploads/UnicodeIcon/` +
                          this.state.photo,
                      }}
                      resizeMode={'contain'}
                      style={{width: 86, height: 86}}
                    />
                  ) : (
                    <Image
                      source={require('../../../assets/image/takeIcon.png')}
                      resizeMode={'contain'}
                      style={[
                        {width: 86, height: 86},
                        this.state.photo_error && {
                          borderWidth: 1,
                          borderColor: 'red',
                        },
                      ]}
                    />
                  )}
                </TouchableOpacity>

                <View>
                  <Text
                    style={[
                      styles.nazvaniaText,
                      this.state.surname_error
                        ? {color: 'red'}
                        : {color: '#333333'},
                    ]}>
                    Фамилия*
                  </Text>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[
                      styles.nazvania,
                      this.state.surname_error
                        ? {borderColor: 'red'}
                        : {borderColor: '#F5F5F5'},
                    ]}
                    value={this.state.surname}
                    onChangeText={value => {
                      this.setState({surname: value, surname_error: false});
                    }}
                  />
                </View>

                <View>
                  <Text
                    style={[
                      styles.nazvaniaText,
                      this.state.name_error
                        ? {color: 'red'}
                        : {color: '#333333'},
                    ]}>
                    Имя*
                  </Text>
                  <TextInput
                    underlineColorAndroid="transparent"
                    style={[
                      styles.nazvania,
                      this.state.name_error
                        ? {borderColor: 'red'}
                        : {borderColor: '#F5F5F5'},
                    ]}
                    value={this.state.name}
                    onChangeText={value => {
                      this.setState({name: value, name_error: false});
                    }}
                  />
                </View>
                <View
                  style={{
                    position: 'relative',
                  }}>
                  <Text
                    style={[
                      styles.nazvaniaText,
                      this.state.changed_city_error
                        ? {color: 'red'}
                        : {color: '#5B5B5B'},
                    ]}>
                    Город*
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.selectButton,
                      this.state.changed_city_error
                        ? {borderColor: 'red'}
                        : {borderColor: '#F5F5F5'},
                    ]}
                    onPress={() => {
                      this.getCityApi();
                    }}>
                    <Text style={styles.selectedText}>
                      {this.state.changed_city}
                    </Text>

                    <View style={{position: 'absolute', right: 17, bottom: 18}}>
                      {!this.state.OpenCityDropDown && (
                        <Svg
                          width="18"
                          height="10"
                          viewBox="0 0 18 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <Path
                            d="M1 1L9 9L17 1"
                            stroke="#888888"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </Svg>
                      )}
                      {this.state.OpenCityDropDown && (
                        <Svg
                          width="18"
                          height="10"
                          viewBox="0 0 18 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <Path
                            d="M1 9L9 1L17 9"
                            stroke="#888888"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </Svg>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View
                    style={
                      this.state.OpenCityDropDown
                        ? styles.OpenCityDropDownActive
                        : styles.OpenCityDropDown
                    }>
                    <ScrollView nestedScrollEnabled={true}>
                      {this.state.cityItems.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              textAlign: 'left',
                            }}
                            onPress={() => {
                              this.getManufacturerChangeCity(
                                item,
                                this.state.searchUser,
                              );
                              this.setState({
                                city_id_l: item,
                                OpenCityDropDown: false,
                              });
                            }}>
                            <Text
                              style={{
                                textAlign: 'left',
                                paddingVertical: 10,
                                fontFamily: 'Poppins_500Medium',
                              }}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>

                <View style={styles.searchParent}>
                  <TouchableOpacity
                    onPress={() => {
                      this.getManufacturerChangeCity(this.state.city_id_l, '');
                      this.setState({searchUser: ''});
                    }}>
                    {this.state.searchUser !== '' ? (
                      <Svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M1.46343 2.89891C1.39564 2.83476 1.34186 2.7586 1.30518 2.67479C1.26849 2.59097 1.24961 2.50114 1.24961 2.41042C1.24961 2.31969 1.26849 2.22986 1.30518 2.14604C1.34186 2.06223 1.39564 1.98607 1.46343 1.92192C1.53122 1.85777 1.6117 1.80689 1.70027 1.77217C1.78885 1.73745 1.88378 1.71958 1.97965 1.71958C2.07552 1.71958 2.17045 1.73745 2.25902 1.77217C2.3476 1.80689 2.42808 1.85777 2.49587 1.92192L10 9.02439L17.5041 1.92192C17.5719 1.85777 17.6524 1.80689 17.741 1.77217C17.8295 1.73745 17.9245 1.71958 18.0204 1.71958C18.1162 1.71958 18.2112 1.73745 18.2997 1.77217C18.3883 1.80689 18.4688 1.85777 18.5366 1.92192C18.6044 1.98607 18.6581 2.06223 18.6948 2.14604C18.7315 2.22986 18.7504 2.31969 18.7504 2.41042C18.7504 2.50114 18.7315 2.59097 18.6948 2.67479C18.6581 2.7586 18.6044 2.83476 18.5366 2.89891L11.031 10L18.5366 17.1011C18.6044 17.1652 18.6581 17.2414 18.6948 17.3252C18.7315 17.409 18.7504 17.4989 18.7504 17.5896C18.7504 17.6803 18.7315 17.7701 18.6948 17.854C18.6581 17.9378 18.6044 18.0139 18.5366 18.0781C18.4688 18.1422 18.3883 18.1931 18.2997 18.2278C18.2112 18.2626 18.1162 18.2804 18.0204 18.2804C17.9245 18.2804 17.8295 18.2626 17.741 18.2278C17.6524 18.1931 17.5719 18.1422 17.5041 18.0781L10 10.9756L2.49587 18.0781C2.42808 18.1422 2.3476 18.1931 2.25902 18.2278C2.17045 18.2626 2.07552 18.2804 1.97965 18.2804C1.88378 18.2804 1.78885 18.2626 1.70027 18.2278C1.6117 18.1931 1.53122 18.1422 1.46343 18.0781C1.39564 18.0139 1.34186 17.9378 1.30518 17.854C1.26849 17.7701 1.24961 17.6803 1.24961 17.5896C1.24961 17.4989 1.26849 17.409 1.30518 17.3252C1.34186 17.2414 1.39564 17.1652 1.46343 17.1011L8.96902 10L1.46343 2.89891Z"
                          fill="black"
                        />
                      </Svg>
                    ) : (
                      <Svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Path
                          d="M17.7656 16.6895L12.6934 11.6172C13.4805 10.5996 13.9063 9.35547 13.9063 8.04688C13.9063 6.48047 13.2949 5.01172 12.1895 3.9043C11.084 2.79687 9.61133 2.1875 8.04688 2.1875C6.48242 2.1875 5.00977 2.79883 3.9043 3.9043C2.79687 5.00977 2.1875 6.48047 2.1875 8.04688C2.1875 9.61133 2.79883 11.084 3.9043 12.1895C5.00977 13.2969 6.48047 13.9063 8.04688 13.9063C9.35547 13.9063 10.5977 13.4805 11.6152 12.6953L16.6875 17.7656C16.7024 17.7805 16.72 17.7923 16.7395 17.8004C16.7589 17.8084 16.7797 17.8126 16.8008 17.8126C16.8218 17.8126 16.8427 17.8084 16.8621 17.8004C16.8815 17.7923 16.8992 17.7805 16.9141 17.7656L17.7656 16.916C17.7805 16.9011 17.7923 16.8835 17.8004 16.864C17.8084 16.8446 17.8126 16.8238 17.8126 16.8027C17.8126 16.7817 17.8084 16.7609 17.8004 16.7414C17.7923 16.722 17.7805 16.7043 17.7656 16.6895V16.6895ZM11.1406 11.1406C10.3125 11.9668 9.21484 12.4219 8.04688 12.4219C6.87891 12.4219 5.78125 11.9668 4.95313 11.1406C4.12695 10.3125 3.67188 9.21484 3.67188 8.04688C3.67188 6.87891 4.12695 5.7793 4.95313 4.95313C5.78125 4.12695 6.87891 3.67188 8.04688 3.67188C9.21484 3.67188 10.3145 4.125 11.1406 4.95313C11.9668 5.78125 12.4219 6.87891 12.4219 8.04688C12.4219 9.21484 11.9668 10.3145 11.1406 11.1406Z"
                          fill="black"
                        />
                      </Svg>
                    )}
                  </TouchableOpacity>
                  <TextInput
                    placeholder="Поиск"
                    placeholderTextColor="#000"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderColor: '#D9D9D9',
                      borderRightWidth: 1,
                      color: '#5B5B5B',
                      fontSize: 12,
                      fontFamily: 'Poppins_500Medium',
                    }}
                    value={this.state.searchUser}
                    onChangeText={text => {
                      this.setState({searchUser: text});
                      this.getManufacturerChangeCity(
                        this.state.city_id_l,
                        text,
                      );
                    }}
                  />
                </View>
                <Text style={styles.changedCustomersTitleBox}>
                  Производители
                </Text>

                {this.state.manufacture_get.length === 0 && (
                  <Text
                    style={{
                      color: '#333333',
                      textAlign: 'center',
                      marginTop: 20,
                    }}>
                    Для показа производителей выберите город
                  </Text>
                )}

                <View style={styles.customersParentContainer}>
                  {this.state.manufacture_get.map((item, index) => {
                    return (
                      <View key={index} style={styles.userIndex}>
                        <FastImage
                          style={styles.userLogo}
                          source={{
                            uri: `https://admin.refectio.ru/storage/app/uploads/${item.logo}`,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                        <Text style={styles.customerName}>
                          {item.company_name}
                        </Text>

                        <TouchableOpacity
                          style={[
                            styles.takeItButton,
                            this.verifyCheckBox(item.id) === true
                              ? {backgroundColor: '#B5D8FE'}
                              : {backgroundColor: '#F5F5F5'},
                          ]}
                          onPress={() => {
                            this.enterCheckBox(item);
                          }}>
                          <Text
                            style={[
                              styles.takeItText,
                              this.verifyCheckBox(item.id) === true
                                ? {color: '#FFFFFF'}
                                : {color: '#838383'},
                            ]}>
                            {this.verifyCheckBox(item.id) === true
                              ? 'Выбрано'
                              : 'Выбрать'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.nextPage}
                  onPress={() => {
                    this.createNewCustomer();
                  }}>
                  <BlueButton name="Готово" />
                </TouchableOpacity>
              </ScrollView>
            </>
          </View>
          {this.state.keyboardOpen === false && (
            <DesignerPageNavComponent
              active_page={'Заказы'}
              navigation={this.props.navigation}
            />
          )}
          {this.state.isLoading && <Loading />}
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  searchParent: {
    marginVertical: 17,
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F5F5F5',
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
    color:'#5B5B5B'
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
