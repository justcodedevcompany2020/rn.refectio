import React, {Component, useState} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Keyboard,
  Modal,
} from 'react-native';
import ArrowGrayComponent from '../../assets/image/ArrowGray';
import BlueButton from '../Component/Buttons/BlueButton';
import CustomerMainPageNavComponent from './CustomerMainPageNav';
import Svg, {Path, Rect} from 'react-native-svg';
// import * as ImagePicker from "expo-image-picker";
import ImagePicker from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loading from '../Component/Loading';
import RichTextEditorComponent from '../Auth/RichTextEditor';
import ImageWithLoadingIndicator from './ImageWithLoading';
import LoadingAdd from '../Component/LoadingAdd';

export default class AddProductComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_images: [],
      nextIndex: 1,
      buttonSend: true,
      keyboardOpen: false,
      buttonBlue: false,
      category: false,
      categoryChanged: '',
      categoryChanged_error: '',
      categoryId: '',
      img: null,
      name: '',
      name_error: false,

      frame: '',

      facades: '',
      facades_error: false,

      length: '',
      length_error: false,

      height: '',
      height_error: false,

      price: '',
      price_error: false,

      material: '',
      profile: '',

      tabletop: '',
      tabletop_error: false,
      all_images: [],
      all_images_error: false,

      categoryArray: [],

      modalBool: false,

      // buttonSend: true,
      isLoading: false,

      hasFacades: false,
      hasFrame: false,
      hasTableTop: false,
      hasLength: false,
      hasHeight: false,
      hasProfile: false,
      hasMaterial: false,
    };
  }
  formdata = new FormData();

  pickImage = async () => {
    this.setState({buttonSend: false, buttonBlue: false});

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 50,
    });

    if (!result.canceled) {
      await Promise.all(
        result.assets.map(async element => {
          // Simulate asynchronous image upload process with setTimeout
          await new Promise(resolve => setTimeout(resolve, 1000));

          this.setState(prevState => ({
            buttonBlue: true,
            all_images: [
              ...prevState.all_images,
              {
                uri: element.uri,
                type: 'image/jpg',
                name: 'photo.jpg',
              },
            ],
          }));
        }),
      );
    }

    this.setState({buttonSend: true});
  };

  clearAllData = () => {
    this.setState({
      keyboardOpen: false,
      category: false,
      categoryChanged: '',
      categoryChanged_error: '',
      categoryId: '',
      img: null,

      name: '',
      name_error: false,

      frame: '',

      facades: '',
      facades_error: false,

      length: '',
      length_error: false,

      height: '',
      height_error: false,

      price: '',
      price_error: false,

      material: '',
      profile: '',

      tabletop: '',
      tabletop_error: false,
      all_images: [],
      all_images_error: false,

      categoryArray: [],

      modalBool: false,

      buttonSend: true,

      limitError: false,
      isLoading: false,

      hasFacades: false,
      hasFrame: false,
      hasTableTop: false,
      hasLength: false,
      hasProfile: false,
      hasHeight: false,
      hasMaterial: false,
    });
  };

  delateSelectedImage = async index => {
    let {all_images} = this.state;

    let new_all_images = [];

    for (let i = 0; i < all_images.length; i++) {
      if (i == index) {
        continue;
      }
      new_all_images.push(all_images[i]);
    }
    this.setState({
      all_images: new_all_images,
    });
  };

  sendProduct = async () => {
    this.setState({buttonBlue: false});
    let {all_images} = this.state;

    if (all_images.length === 0) {
      this.setState({all_images_error: true});
    }
    if (this.state.all_images.length > 0) {
      await all_images.map((element, index) => {
        this.formdata.append('photo[]', element);
      });
    }

    if (this.state.all_images.length > 10) {
      this.setState({limitError: true});
      return;
    } else {
      this.setState({limitError: false});
    }

    this.setState({isLoading: true});

    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);
    myHeaders.append('Content-Type', 'multipart/form-data');

    if (this.props.category.parent) {
      this.formdata.append('parent_category_id', this.props.category.parent.id);
      this.formdata.append(
        'parent_category_name',
        this.props.category.parent.name,
      );

      this.formdata.append('category_id', this.props.category.id);
      this.formdata.append('category_name', this.props.category.name);
    } else {
      this.formdata.append('parent_category_id', this.props.category.id);
      this.formdata.append('parent_category_name', this.props.category.name);
    }

    this.formdata.append('name', this.state.name);
    this.formdata.append('frame', this.state.frame);
    this.formdata.append('facades', this.state.facades);
    this.formdata.append('length', this.state.length);
    this.formdata.append('height', this.state.height);

    let myPrice = this.state.price.replaceAll('.', '');
    this.formdata.append('price', myPrice);
    this.formdata.append('tabletop', this.state.tabletop);
    this.formdata.append('material', this.state.material);
    this.formdata.append('profile', this.state.profile);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: this.formdata,
      redirect: 'follow',
    };

    await fetch(
      `https://admin.refectio.ru/public/api/createnewproductProizvoditel`,
      requestOptions,
    )
      .then(response => response.json())
      .then(async result => {
        this.setState({isLoading: false, buttonBlue: false});
        if (result.status === true) {
          (await this.setState({
            modalBool: true,
          })) && (await this.clearAllData());
        } else if (result.status !== true) {
          this.setState({buttonBlue: true});
          if (result.hasOwnProperty('category_name')) {
            this.setState({
              categoryChanged_error: true,
            });
          } else {
            this.setState({
              categoryChanged_error: false,
            });
          }

          if (result.hasOwnProperty('name')) {
            this.setState({
              name_error: true,
            });
          } else {
            this.setState({
              name_error: false,
            });
          }

          if (result.hasOwnProperty('photo')) {
            this.setState({
              all_images_error: true,
            });
          } else {
            this.setState({
              all_images_error: false,
            });
          }

          // if (
          //   result.data?.message ==
          //   "you already have 3 products under this category"
          // ) {
          //   await this.setState({ limitError: true });
          // }
        }
        this.formdata = new FormData();
      })
      .catch(error => console.log('error', error));
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    this.setState({
      hasFacades:
        this.props.category.id == 28 ||
        this.props.category.id == 30 ||
        this.props.category.id == 31 ||
        this.props.category.id == 36 ||
        this.props.category.parent_id == 4 ||
        this.props.category.id == 42 ||
        this.props.category.id == 66 ||
        this.props.category.id == 43 ||
        this.props.category.id == 45 ||
        this.props.category.id == 46 ||
        this.props.category.id == 50 ||
        this.props.category.id == 51 ||
        this.props.category.id == 57 ||
        this.props.category.id == 63 ||
        this.props.category.id == 58 ||
        this.props.category.id == 65,
      hasFrame:
        this.props.category.id == 28 ||
        this.props.category.id == 30 ||
        this.props.category.id == 57 ||
        this.props.category.id == 31 ||
        this.props.category.id == 36 ||
        this.props.category.id == 37 ||
        this.props.category.parent_id == 4 ||
        this.props.category.id == 42 ||
        this.props.category.id == 43 ||
        this.props.category.id == 94 ||
        this.props.category.id == 45 ||
        this.props.category.id == 46 ||
        this.props.category.id == 50 ||
        this.props.category.id == 51 ||
        this.props.category.id == 95 ||
        this.props.category.id == 58 ||
        this.props.category.id == 96 ||
        this.props.category.id == 63 ||
        this.props.category.id == 97 ||
        this.props.category.id == 65 ||
        this.props.category.id == 66 ||
        this.props.category.id == 98,
      hasTableTop:
        this.props.category.id == 28 ||
        this.props.category.id == 30 ||
        this.props.category.id == 40 ||
        this.props.category.id == 50,
      hasLength:
        this.props.category.id == 28 ||
        this.props.category.id == 30 ||
        this.props.category.id == 31 ||
        this.props.category.id == 36 ||
        this.props.category.id == 37 ||
        this.props.category.parent_id == 4 ||
        this.props.category.id == 42 ||
        this.props.category.id == 43 ||
        this.props.category.id == 94 ||
        this.props.category.id == 45 ||
        this.props.category.id == 46 ||
        this.props.category.id == 50 ||
        this.props.category.id == 51 ||
        this.props.category.id == 95 ||
        this.props.category.id == 57 ||
        this.props.category.id == 58 ||
        this.props.category.id == 96 ||
        this.props.category.id == 63 ||
        this.props.category.id == 97 ||
        this.props.category.id == 65 ||
        this.props.category.id == 98,
      hasHeight:
        this.props.category.id == 31 ||
        this.props.category.id == 36 ||
        this.props.category.id == 37 ||
        this.props.category.id == 41 ||
        this.props.category.id == 43 ||
        this.props.category.id == 94 ||
        this.props.category.id == 50 ||
        this.props.category.id == 51 ||
        this.props.category.id == 95 ||
        this.props.category.id == 57 ||
        this.props.category.id == 58 ||
        this.props.category.id == 96 ||
        this.props.category.id == 97 ||
        this.props.category.id == 63 ||
        this.props.category.id == 66 ||
        this.props.category.id == 98,
      hasMaterial:
        this.props.category.id == 28 ||
        this.props.category.id == 30 ||
        this.props.category.id == 31 ||
        this.props.category.id == 36 ||
        this.props.category.id == 37 ||
        this.props.category.parent_id == 4 ||
        this.props.category.id == 40 ||
        this.props.category.id == 41 ||
        this.props.category.id == 42 ||
        this.props.category.id == 43 ||
        this.props.category.id == 45 ||
        this.props.category.id == 46 ||
        this.props.category.id == 50 ||
        this.props.category.id == 51 ||
        this.props.category.id == 57 ||
        this.props.category.id == 58 ||
        this.props.category.id == 63 ||
        this.props.category.id == 65 ||
        this.props.category.id == 66 ||
        this.props.category.id == 94 ||
        this.props.category.id == 95 ||
        this.props.category.id == 96 ||
        this.props.category.id == 97 ||
        this.props.category.id == 98,
      hasProfile:
        this.props.category.id == 37 ||
        this.props.category.id == 94 ||
        this.props.category.id == 95 ||
        this.props.category.id == 96 ||
        this.props.category.id == 97 ||
        this.props.category.id == 98,
    });
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

  findInstring = (cat, cat_arr) => {
    let bool = false;
    for (const cat_arr_item in cat_arr) {
      if (cat == cat_arr[cat_arr_item]) {
        bool = true;
      }
    }

    return bool;
  };

  truncateText = (text, maxLength) => {
    if (
      text.length <= maxLength &&
      this.props.category.parent?.name.length >= 30
    ) {
      return text;
    }
    return text.substring(0, maxLength - 2);
  };

  render() {
    const longText = this.props.category.name;
    const truncatedText = this.truncateText(longText, 9);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.main}>
          <Modal visible={this.state.modalBool}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 80, height: 80}}
                source={require('../../assets/image/flat-color-icons_ok.png')}
              />
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 22,
                  fontFamily: 'Poppins_500Medium',
                  fontSize: 25,
                  color: '#2D9EFB',
                }}>
                Вы успешно{'\n'}добавили продукт
              </Text>

              <TouchableOpacity
                style={{marginTop: 170}}
                onPress={async () => {
                  await this.props.navigation.navigate('Praductia', {
                    params: this.props.user_id,
                  });
                  await this.clearAllData();
                }}>
                <BlueButton name="В каталог" />
              </TouchableOpacity>
            </View>
          </Modal>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
              this.clearAllData();
            }}
            style={{
              position: 'absolute',
              left: 11.66,
              top: 10,
              zIndex: 100,
            }}>
            <ArrowGrayComponent />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Poppins_600SemiBold',
                textAlign: 'center',
                marginTop: 15,
              }}>
              Добавление продукции
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Категория */}
            <View>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                    marginTop: 12,
                  },
                  this.state.categoryChanged_error
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                Категория
              </Text>
              <View
                style={{
                  position: 'relative',
                }}>
                <View
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: '#F5F5F5',
                      padding: 10,
                      width: '100%',
                      borderRadius: 6,
                      position: 'relative',
                      height: 45,
                      marginRight: 12,
                    },
                    this.state.categoryChanged_error
                      ? {borderColor: 'red'}
                      : {borderColor: '#F5F5F5'},
                  ]}>
                  <Text
                    style={{
                      color: '#5B5B5B',
                      fontFamily: 'Poppins_500Medium',
                    }}>
                    {this.props.category.parent &&
                      this.props.category.parent?.name + ' -> '}
                    {/* {this.props.category.name} */}

                    {this.props.category.parent?.name.length >= 25
                      ? `${truncatedText}`
                      : this.props.category.name}
                  </Text>
                </View>
              </View>
            </View>

            {/* Название */}
            <View>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                    marginTop: 25,
                  },
                  this.state.name_error ? {color: 'red'} : {color: '#5B5B5B'},
                ]}>
                Название*
              </Text>
              <TextInput
                underlineColorAndroid="transparent"
                multiline={false}
                placeholderTextColor={'#888888'}
                placeholder="Кухня ЛРАЙ145 МДФ ПВХ Сатин Бежевый/СИСТЕМА"
                numberOfLines={1}
                keyboardType="default"
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    paddingRight: 0,
                    width: '100%',
                    borderRadius: 5,
                    fontSize: 13.5,
                    color: '#5B5B5B',
                  },
                  this.state.name_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                value={this.state.name}
                onChangeText={text => {
                  this.setState({name: text, name_error: false});
                }}
                maxLength={42}
              />
            </View>

            {/* Материал */}
            {!this.state.hasMaterial ? (
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                    marginTop: 12,
                  }}>
                  Материал
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Эмаль"
                  placeholderTextColor={'#888888'}
                  keyboardType="default"
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                    color: '#5B5B5B',
                  }}
                  value={this.state.material}
                  onChangeText={text => this.setState({material: text})}
                />
              </View>
            ) : null}

            {/* Фасады */}
            {this.state.hasFacades ? (
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                    marginTop: 12,
                  }}>
                  Фасады
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Эмаль"
                  keyboardType="default"
                  placeholderTextColor={'#888888'}
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    color: '#5B5B5B',
                    width: '100%',
                    borderRadius: 5,
                  }}
                  value={this.state.facades}
                  onChangeText={text => this.setState({facades: text})}
                />
              </View>
            ) : null}

            {/* Корпус */}
            {this.state.hasFrame ? (
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                    marginTop: 12,
                  }}>
                  Корпус
                </Text>

                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="ДСП"
                  keyboardType="default"
                  placeholderTextColor={'#888888'}
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                    color: '#5B5B5B',
                  }}
                  value={this.state.frame}
                  onChangeText={text => this.setState({frame: text})}
                />
              </View>
            ) : null}

            {/* Профиль */}
            {this.state.hasProfile ? (
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                    marginTop: 12,
                  }}>
                  Профиль
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Aлюминиевый"
                  keyboardType="default"
                  style={{
                    borderWidth: 1,
                    color: '#5B5B5B',
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  value={this.state.profile}
                  onChangeText={text => this.setState({profile: text})}
                />
              </View>
            ) : null}

            {/* Столешница */}
            {this.state.hasTableTop ? (
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                    marginTop: 12,
                  }}>
                  Столешница
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Камень"
                  keyboardType="default"
                  placeholderTextColor={'#888888'}
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    color: '#5B5B5B',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  value={this.state.tabletop}
                  onChangeText={text => this.setState({tabletop: text})}
                />
              </View>
            ) : null}

            {/* Высота */}
            {this.state.hasHeight ? (
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                    marginTop: 12,
                  }}>
                  Высота
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="0.5 метров"
                  keyboardType="decimal-pad"
                  placeholderTextColor={'#888888'}
                  style={{
                    borderWidth: 1,
                    color: '#5B5B5B',
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  value={this.state.height}
                  onChangeText={text => this.setState({height: text})}
                />
              </View>
            ) : null}

            {/* Длина */}
            {this.state.hasLength ? (
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                    marginTop: 12,
                  }}>
                  Длина
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="8 метров"
                  keyboardType="numeric"
                  placeholderTextColor={'#888888'}
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    color: '#5B5B5B',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  value={this.state.length}
                  onChangeText={text => this.setState({length: text})}
                />
              </View>
            ) : null}

            {/* Цена */}
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  lineHeight: 23,
                  fontSize: 16,
                  color: '#5B5B5B',
                  marginBottom: 5,
                  marginTop: 12,
                }}>
                Цена
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="1.000.000"
                  placeholderTextColor={'#888888'}
                  keyboardType="number-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    color: '#5B5B5B',
                    padding: 10,
                    width: '89%',
                    borderRadius: 5,
                    color: '#5B5B5B',
                    marginRight: 5,
                  }}
                  value={this.state.price}
                  maxLength={9}
                  onChangeText={text => {
                    let without_dots = text.split('.').join('');
                    let with_dots = without_dots
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                    this.setState({price: with_dots});
                  }}
                />
                <Image
                  source={require('../../assets/image/apranqiGin.png')}
                  style={{width: 30, height: 50}}
                />
              </View>
            </View>

            {/* imageeeee */}
            <Text
              style={[
                {
                  fontSize: 16,
                  fontFamily: 'Poppins_500Medium',
                  marginTop: 15,
                },
                this.state.all_images_error
                  ? {color: 'red'}
                  : {color: '#5B5B5B'},
              ]}>
              {this.state.all_images_error
                ? 'Загрузите фотографию'
                : 'Фотографии продукта*'}
            </Text>
            <TouchableOpacity
              onPress={() => this.pickImage()}
              style={{
                width: 165,
                height: 38,
                backgroundColor: '#B5D8FE',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 12,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#fff',
                  textAlign: 'center',
                  // fontFamily: 'Poppins_500Medium',
                  fontWeight: '700',
                }}>
                Загрузить
              </Text>
            </TouchableOpacity>
            {this.state.all_images.length > 0 && (
              <ScrollView
                horizontal={true}
                style={{marginTop: 30}}
                showsHorizontalScrollIndicator={false}>
                {this.state.all_images.map((item, index) => (
                  <ImageWithLoadingIndicator
                    key={index}
                    source={{uri: item.uri}}
                    onDelete={this.delateSelectedImage}
                    index={index}
                  />
                ))}
              </ScrollView>
            )}
            {this.state.limitError === true && (
              <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>
                На данный момент можно загружать не более 10 фото по одному
                товару.
              </Text>
            )}

            <TouchableOpacity
              onPress={() => {
                if (this.state.buttonSend === true) {
                  this.sendProduct();
                }
              }}
              style={{
                alignSelf: 'center',
                marginTop: 60,
                marginBottom: 250,
              }}>
              <View
                style={{
                  backgroundColor: '#B5D8FE',
                  width: 285,
                  height: 44,
                  justifyContent: 'center',
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    textAlign: 'center',
                    fontFamily: 'Poppins_SemiBold',
                    fontWeight: '700',
                  }}>
                  Добавить
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {this.state.keyboardOpen === false && (
          <CustomerMainPageNavComponent navigation={this.props.navigation} />
        )}
        {this.state.isLoading && <LoadingAdd />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  container: {
    position: 'relative',
    paddingBottom: 3,
  },
  sOpenCityDropDown: {
    width: '100%',
    height: 0,
  },
  sOpenCityDropDownActive: {
    width: '100%',
    height: 120,
    elevation: 2,
    borderColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
  },
});
