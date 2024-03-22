import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
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

export default class EditZakazchikDesignerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityItems: [],
      city_id: '',
      keyboardOpen: false,
      iconsModal: false,
      iconItems: false,
      OpenCityDropDown: false,
      OpenCityDropDown_error: false,
      manufacture_get: [],
      changed_city: '',
      changed_city_error: false,
      some_id: '',
      surname: '',
      surname_error: false,
      name: '',
      name_error: false,
      photo: '',
      photo_error: false,
      proizvoditel_id: [],
      iconsArray: [],
      isLoading: false,
      data: [],
    };
    this.ref = React.createRef();
  }

  fetchData = async () => {
    const {data, isLastPage} = this.state;
    // console.log(this.props, 'props');
    let token = await AsyncStorage.getItem('userToken');
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
      some_id: this.props.route.params.params,
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/SinglePageOrdersFromDesigner?page=1`,
      requestOptions,
    )
      .then(response => response.json())
      .then(async responseJson => {
        console.log(responseJson, 'response');
        if (responseJson.status === true) {
          this.setState({
            some_id: responseJson?.order_data?.id,
            name: responseJson?.order_data?.name,
            surname: responseJson?.order_data?.surname,
            photo: responseJson?.order_data?.photo,
            city_id: responseJson.order_data.city,
          });
          if (responseJson.My_Data.data.length > 0) {
            await this.setState({
              data: [...data, ...responseJson?.My_Data?.data],
              isLoading: false,
            });
            this.getCityApi();
            this.getManufacturerChangeCity(responseJson.order_data.city);
          } else {
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
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

    await fetch(
      `https://admin.refectio.ru/public/api/getCityApi`,
      requestOptions,
    )
      .then(response => response.json())
      .then(res => {
        if (this.state.OpenCityDropDown == true && res.status === true) {
          this.setState({OpenCityDropDown: true});
        } else {
          this.setState({
            OpenCityDropDown: false,
            OpenCityDropDown_error: true,
          });
        }
        this.setState({cityItems: res.data.city});
      });
  };

  getManufacturerChangeCity = async city => {
    // await this.setState({changed_city: city.name});
    // if (this.state.changed_city === '') {
    //   this.setState({changed_city_error: true});
    // } else {
    //   this.setState({changed_city_error: false});
    // }
    let token = await AsyncStorage.getItem('userToken');

    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);

    let formdata = new FormData();
    formdata.append('city_id', city);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`https://admin.refectio.ru/public/api/manufactur-get`, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log(result, 'ress');
        if (result.status === true) {
          this.setState({
            manufacture_get: result.data,
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
      form_data.append('proizvoditel_id', this.state.proizvoditel_id[i]);
      console.log(this.state.proizvoditel_id[i], 'khh');
    }

    form_data.append('some_id', this.state.some_id);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: form_data,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/manufactur-insert`,
      requestOptions,
    )
      .then(response => response.json())
      .then(async result => {
        console.log('res', result);
        if (result.status === true) {
          this.props.navigation.navigate('ZakaziLiveDesigner');
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

  componentDidMount() {
    const {navigation} = this.props;

    this.fetchData();
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
    console.log(
      this.state.cityItems.filter(el => el.id == this.state.city_id)[0]?.name,
    );
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
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
                                style={{width: 72.77, height: 62.78}}
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
                // this.getAllIcons();
                // this.setState({iconsModal: true});
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
                // placeholder="Шкаф «Ансамбль»"
                editable={false}
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
                  this.state.name_error ? {color: 'red'} : {color: '#333333'},
                ]}>
                Имя*
              </Text>
              <TextInput
                underlineColorAndroid="transparent"
                // placeholder="Шкаф «Ансамбль»"
                editable={false}
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

            {/* dropDown city start*/}

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
                  {this.state.changed_city
                    ? this.state.changed_city
                    : this.state.cityItems.filter(
                        el => el.id == this.state.city_id,
                      )[0]?.name}
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
                          this.getManufacturerChangeCity(item);
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
            {/* dropDown city end*/}

            <Text style={styles.changedCustomersTitleBox}>Производители</Text>

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
              {this.state.manufacture_get.map((item, index) => (
                <View key={index} style={styles.userIndex}>
                  <Image
                    source={{
                      uri:
                        `https://admin.refectio.ru/storage/app/uploads/` +
                        item.logo,
                    }}
                    style={styles.userLogo}
                    resizeMode={'cover'}
                  />

                  <Text style={styles.customerName}>{item.company_name}</Text>

                  <TouchableOpacity
                    style={[
                      styles.takeItButton,
                      this.verifyCheckBox(item.id) === true ||
                      this.state.data.filter(el => el.id === item.id)[0]?.id ==
                        item.id
                        ? {backgroundColor: '#B5D8FE'}
                        : {backgroundColor: '#F5F5F5'},
                    ]}
                    onPress={() => {
                      this.enterCheckBox(item);
                    }}>
                    <Text
                      style={[
                        styles.takeItText,
                        this.verifyCheckBox(item.id) === true ||
                        this.state.data.filter(el => el.id === item.id)[0]
                          ?.id == item.id
                          ? {color: '#FFFFFF'}
                          : {color: '#838383'},
                      ]}>
                      {this.verifyCheckBox(item.id) === true ||
                      this.state.data.filter(el => el.id === item.id)[0]?.id ==
                        item.id
                        ? 'Выбрано'
                        : 'Выбрать'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.nextPage}
              onPress={() => {
                this.createNewCustomer();
              }}>
              <BlueButton name="Готово" />
            </TouchableOpacity>
          </ScrollView>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
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
