import React, {Component} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import Svg, {Path, Rect} from 'react-native-svg';
import ArrowGrayComponent from '../../assets/image/ArrowGray';
import BlueButton from '../Component/Buttons/BlueButton';
import ImagePicker from 'react-native-image-crop-picker';
// import * as ImagePicker from "expo-image-picker";
// import {launchImageLibrary} from 'react-native-image-picker';

export default class RegistrationManufacturerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sOpenCityDropDown: false,
      sOpenCityDropDown1: false,
      sOpenCityDropDown2: false,
      sOpenCityDropDown3: false,
      sOpenCityDropDown4: false,
      sOpenCityDropDown5: false,

      cityItems: [],
      sales_city: [],
      sales_city_error: false,
      cityChange: '',
      allCities: false,

      getProductCategory: [],
      category: '',

      logo: null,
      logo_error: false,

      company_name: '',
      company_name_error: false,
      name_exists_error: false,

      phone: '',
      phone_error: false,
      phone_exist: false,

      individual_number: '',
      individual_number_error: false,

      password: '',
      password_error: false,

      password_confirmation: '',
      password_confirmation_error: false,

      watsap_phone: '',
      watsap_phone_error: false,

      i_agree: false,
      i_agree_error: false,

      made_in_array: [],
      made_in_select: false,
      made_in: '',
      made_in_error: false,

      saite: '',

      telegram: 't.me/',
      // tg: 't.me/',

      show_room_arr: [
        {name: 'Да', id: 1},
        {name: 'Нет', id: 2},
      ],
      show_room: 'Нет',
      show_room_error: false,

      collaborate: 'Нет',
      d3model: 'Нет',

      percent_bonus: [],
      percent_bonus_error: false,

      // product_category: [],
      // product_category_error: false,

      item_id: null,

      accessToken: null,

      count: 0,
      countCity: 0,

      procentArray: [
        {
          to: '0',
          from: 'datark',
          percent: '',
        },
      ],
      procentArrayToString: [],

      valid_error: false,

      value_length: '',
      information: false,

      dopInfo: '',
    };
    this.ref = React.createRef();
  }

  removeInputRow = () => {
    let {procentArray} = this.state;

    procentArray.pop();

    this.setState({
      procentArray: procentArray,
    });
  };

  addInputRow = () => {
    let {procentArray} = this.state;

    procentArray.push({
      to: 'datark',
      from: 'datark',
      percent: '',
    });

    this.setState({
      procentArray: procentArray,
    });
  };

  savePercont = async () => {
    let {procentArray} = this.state;

    let result = [];
    let valid_error = false;

    for (let i = 0; i < procentArray.length; i++) {
      if (procentArray[i].percent == '') {
        valid_error = true;
        break;
      }

      let resultString =
        procentArray[i].to +
        '^' +
        procentArray[i].from +
        '^' +
        procentArray[i].percent;
      result.push(resultString);
    }

    if (valid_error) {
      await this.setState({
        valid_error: true,
      });
    } else {
      await this.setState({
        valid_error: false,
        procentArrayToString: result,
      });
    }
  };

  changeTo = (value, index) => {
    let {procentArray} = this.state;
    let without_dots = value.split('.').join('');
    let with_dots = without_dots
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    procentArray[index].to = with_dots;

    this.setState({
      procentArray: procentArray,
    });
  };

  changeFrom = (value, index) => {
    let {procentArray} = this.state;

    let without_dots = value.split('.').join('');
    let with_dots = without_dots
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    procentArray[index].from = with_dots;

    this.setState({
      procentArray: procentArray,
    });
  };

  changePercent = (value, index) => {
    let {procentArray} = this.state;

    procentArray[index].percent = value;

    this.setState({
      procentArray: procentArray,
      valid_error: false,
    });
  };

  // getCategory = async (items, ids) => {
  //   let filterSort = this.state.product_category;
  //   let find = true;
  //   filterSort.find((item) => {
  //     if (item.id == ids) {
  //       find = false;
  //     }
  //   });
  //   if (find) {
  //     filterSort.push({ name: items, id: ids });
  //     this.setState({ count: this.state.count + 1 });
  //   }
  //   await this.setState({ product_category: filterSort });
  // };

  // verifyCategory = (items) => {
  //   let filterSort = this.state.product_category;
  //   let find = false;
  //   filterSort.find((item) => {
  //     if (item == items) {
  //       find = true;
  //     }
  //   });
  //   if (find) {
  //     const index = filterSort.indexOf(items);
  //     filterSort.splice(index, 1);
  //     this.setState({ count: this.state.count - 1 });
  //   }
  //   this.setState({ product_category: filterSort });
  // };

  gorod = async (items, ids) => {
    let filterSort = this.state.sales_city;
    let find = true;
    if (ids == 9999) {
      filterSort = this.state.cityItems
        .filter(el => el.id !== 9999)
        .map((item, i) => ({name: item.name, id: item.id}));
      this.setState({
        allCities: true,
        countCity: this.state.cityItems.length - 1,
      });
    } else {
      filterSort.find(item => {
        if (item.id == ids) {
          find = false;
        }
      });
      if (find) {
        filterSort.push({name: items, id: ids});
        this.setState({countCity: this.state.countCity + 1});
      }
    }
    await this.setState({sales_city: filterSort});
  };

  verifyGorod = items => {
    let filterSort = this.state.sales_city;
    let find = false;
    filterSort.find(item => {
      if (item == items) {
        find = true;
      }
    });
    if (find) {
      const index = filterSort.indexOf(items);
      filterSort.splice(index, 1);
      this.setState({countCity: this.state.countCity - 1});
    }
    this.setState({sales_city: filterSort});
  };

  getCityApi = async () => {
    this.setState({sales_city_error: false});
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
        if (res.status === true) {
          this.setState({sOpenCityDropDown3: !this.state.sOpenCityDropDown3});
        }
        this.setState({
          cityItems: [{name: 'Все города России', id: 9999}, ...res.data.city],
        });
      });
  };

  getProductCategory = async () => {
    await fetch(`https://admin.refectio.ru/public/api/GetProductCategory`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(res => {
        this.setState({getProductCategory: res.data.city});
      })
      .catch(error => error, 'error');
  };

  form_data = new FormData();

  pickImage = async () => {
    const result = await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true, // Enable cropping
      cropperToolbarTitle: 'Crop Image', // Title for the cropping UI
      cropperStatusBarColor: 'black', // StatusBar color for the cropping UI
      cropperToolbarColor: 'black', // Toolbar color for the cropping UI
      cropperToolbarWidgetColor: '#ffffff', // Toolbar icon color for the cropping UI
      cropperActiveWidgetColor: '#ffffff', // Active cropping handle color
      cropperCancelText: 'Cancel', // Text for cancel button in cropping UI
      cropperChooseText: 'Choose', // Text for choose button in cropping UI
      cropperCircleOverlay: false, // Disable circular crop overlay
      width: 300, // Specify width of the cropped image
      height: 300, // Specify height of the cropped image
      cropperChooseText: 'Crop', // Text for crop button in cropping UI
      cropperToolbarTitle: 'Crop Image', // Title for the cropping UI
      cropperCircleOverlay: false, // Disable circular crop overlay
      cropperChooseText: 'Crop', // Text for crop button in cropping UI
      cropperToolbarTitle: 'Crop Image', // Title for the cropping UI
      cropperCircleOverlay: false, // Disable circular crop overlay
      cropperChooseText: 'Crop', // Text for crop button in cropping UI
      cropperToolbarTitle: 'Crop Image', // Title for the cropping UI
      cropperCircleOverlay: false, // Disable circular crop overlay
      cropperChooseText: 'Crop', // Text for crop button in cropping UI
      cropperToolbarTitle: 'Crop Image', // Title for the cropping UI
      cropperCircleOverlay: false, // Disable circular crop overlay
      cropperChooseText: 'Crop', // Text for crop button in cropping UI
      cropperToolbarTitle: 'Crop Image', // Title for the cropping UI
      cropperCircleOverlay: false, // Disable circular crop overlay
      cropperChooseText: 'Crop', // Text for crop button in cropping UI
      cropperToolbarTitle: 'Crop Image', // Title for the cropping UI
      cropperCircleOverlay: false, // Disable circular crop overlay
    });

    if (!result.didCancel) {
      this.setState({
        logo: result.path, // Use cropped image path
        logo_error: false,
      });

      this.form_data.append('logo', {
        uri: result.path,
        type: 'image/jpeg', // Set the correct image type
        name: 'photo.jpg',
      });
    } else {
      this.setState({logo_error: true, logo: null});
    }
  };

  getCountry = async () => {
    this.setState({made_in_error: false});
    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    await fetch(
      `https://admin.refectio.ru/public/api/AllCountry`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result, 'country');
        this.setState({
          made_in_array: result.new_order_data,
          made_in_select: true,
        });
      })
      .catch(error => console.log('error', error));
  };

  getMainApi = async () => {
    await this.savePercont();

    const {
      company_name,
      phone,
      password,
      password_confirmation,
      individual_number,
      watsap_phone,
      made_in,
      show_room,
      collaborate,
      d3model,
      // percent_bonus,
      sales_city,
      // product_category,
      dopInfo,
    } = this.state;

    console.log(dopInfo);

    // let new_product_category = [];
    // for (let i = 0; i < product_category.length; i++) {
    //   let category = product_category[i].id + "^" + product_category[i].name;
    //   new_product_category.push(category);
    // }

    let new_sales_city = [];
    for (let i = 0; i < sales_city.length; i++) {
      let city = sales_city[i].id + '^' + sales_city[i].name;
      new_sales_city.push(city);
    }

    let telegram = this.state.telegram.replace('t.me/', '');
    let saite = this.state.saite.replace('https://', '');

    if (saite === '') {
      saite = null;
    }
    this.form_data.append('company_name', company_name);
    this.form_data.append('phone', phone);
    this.form_data.append('password', password);
    this.form_data.append('password_confirmation', password_confirmation);
    this.form_data.append('individual_number', individual_number);
    this.form_data.append('watsap_phone', watsap_phone);
    this.form_data.append('i_agree', this.state.i_agree);
    this.form_data.append('role_id', '3');
    this.form_data.append('made_in', made_in);
    this.form_data.append('saite', saite);
    this.form_data.append('telegram', telegram);
    this.form_data.append('show_room', show_room);
    this.form_data.append('job_with_designer', collaborate);
    this.form_data.append('dmodel', d3model);
    this.form_data.append('sales_city', new_sales_city);
    // this.form_data.append("product_category[]", new_product_category);
    // this.form_data.append("percent_bonus[]", this.state.procentArrayToString);
    this.form_data.append('about_us', dopInfo);

    let requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'multipart/form-data'},
      body: this.form_data,
    };

    fetch(
      `https://admin.refectio.ru/public/api/RegisterManufacturerUser`,
      requestOptions,
    )
      .then(response => response.json())
      .then(async res => {
        // res = res.data;

        console.log(res);
        if (res.success === false && res.message == 'Validation errors') {
          if (res.data.hasOwnProperty('company_name')) {
            this.setState({
              company_name_error: true,
            });
            this.ref.current.scrollTo({x: 0, y: 0, animated: true});
            if (
              res.data.company_name[0] ==
              'The company name has already been taken.'
            ) {
              this.setState({
                name_exists_error: true,
              });
            } else {
              this.setState({
                name_exists_error: false,
              });
            }
          } else {
            this.setState({
              company_name_error: false,
              name_exists_error: false,
            });
          }

          if (res.data.hasOwnProperty('phone')) {
            this.setState({
              phone_error: true,
            });
            this.ref.current.scrollTo({x: 0, y: 0, animated: true});
          } else {
            this.setState({
              phone_error: false,
            });
          }

          if (res.data.hasOwnProperty('password')) {
            this.setState({
              password_error: true,
            });
          } else {
            this.setState({
              password_error: false,
            });
          }

          if (res.data.hasOwnProperty('password_confirmation')) {
            this.setState({
              password_confirmation_error: true,
            });
          } else {
            this.setState({
              password_confirmation_error: false,
            });
          }

          if (res.data.hasOwnProperty('watsap_phone')) {
            this.setState({
              watsap_phone_error: true,
            });
            this.ref.current.scrollTo({x: 0, y: 0, animated: true});
          } else {
            this.setState({
              watsap_phone_error: false,
            });
          }

          if (res.data.hasOwnProperty('made_in')) {
            this.setState({
              made_in_error: true,
            });
            this.ref.current.scrollTo({x: 0, y: 0, animated: true});
          } else {
            this.setState({
              made_in_error: false,
            });
          }

          if (res.data.hasOwnProperty('show_room')) {
            this.setState({
              show_room_error: true,
            });
          } else {
            this.setState({
              show_room_error: false,
            });
          }

          if (res.data.hasOwnProperty('logo')) {
            this.setState({
              logo_error: true,
            });
            // this.ref.current.scrollTo({ x: 0, y: 0, animated: true });
          } else {
            this.setState({
              logo_error: false,
            });
          }

          // if (product_category.length == 0) {
          //   this.setState({
          //     product_category_error: true,
          //   });
          //   this.ref.current.scrollTo({ x: 0, y: 0, animated: true });
          // } else {
          //   this.setState({
          //     product_category_error: false,
          //   });
          // }

          if (sales_city.length == 0) {
            this.setState({
              sales_city_error: true,
            });
            this.ref.current.scrollTo({x: 0, y: 0, animated: true});
          } else {
            this.setState({
              sales_city_error: false,
            });
          }

          // this.form_data = new FormData();

          return false;
        } else if (
          res.success === false &&
          res.message == 'phone arledy exist'
        ) {
          this.setState({
            phone_error: true,
          });
          this.ref.current.scrollTo({x: 0, y: 0, animated: true});
          this.form_data = new FormData();

          return false;
        } else if (
          res.status === false &&
          res.message == 'phone arledy exist'
        ) {
          this.setState({
            phone_exist: true,
          });
          this.form_data = new FormData();
          this.ref.current.scrollTo({x: 0, y: 0, animated: true});
          return false;
        } else if (
          res.status === false &&
          res.message == 'i_agree required true'
        ) {
          this.setState({
            i_agree_error: true,
          });
          this.form_data = new FormData();
        } else if (
          res.status === false &&
          res.message == 'user@ chi ancel hamari verifykacia'
        ) {
          this.props.navigation.navigate('ConfirmTelScreen', {
            params: res.token,
          });
          this.form_data = new FormData();

          return false;
        } else if (res.status === true) {
          this.props.navigation.navigate('ConfirmTelScreen', {
            params: res.data.token,
          });
          await this.clearAllStates();
        }
      })
      .catch(error => console.log(error, 'error'));
  };

  componentDidMount() {
    const {navigation} = this.props;

    this.getProductCategory();

    this.focusListener = navigation.addListener('focus', () => {
      this.getProductCategory();
    });
  }

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener();
    }
  }

  clearAllStates = async () => {
    await this.setState({
      sOpenCityDropDown: false,
      sOpenCityDropDown1: false,
      sOpenCityDropDown2: false,
      sOpenCityDropDown3: false,

      cityItems: [],
      sales_city: [],
      sales_city_error: false,
      cityChange: '',

      getProductCategory: [],
      category: '',

      logo: null,

      company_name: '',
      company_name_error: false,

      phone: '',
      phone_error: false,
      phone_exist: false,

      individual_number: '',
      individual_number_error: false,

      password: '',
      password_error: false,

      password_confirmation: '',
      password_confirmation_error: false,

      watsap_phone: '',
      watsap_phone_error: false,

      i_agree: false,
      i_agree_error: false,

      made_in_array: [],
      made_in_select: false,
      made_in: '',
      made_in_error: false,

      saite: '',
      telegram: '',
      tg: 't.me/',

      show_room_arr: [
        {name: 'Да', id: 1},
        {name: 'Нет', id: 2},
      ],
      show_room: '',
      show_room_error: false,

      collaborate: 'Нет',
      d3model: 'Нет',

      percent_bonus: [],
      percent_bonus_error: false,

      // product_category: [],
      // product_category_error: false,

      item_id: null,

      accessToken: null,

      count: 0,
      countCity: 0,

      procentArray: [
        {
          to: '0',
          from: 'datark',
          percent: '',
        },
      ],
      procentArrayToString: [],

      valid_error: false,
      logo_error: false,
    });

    this.form_data = new FormData();
  };

  goToRegistredScreen = async () => {
    await this.clearAllStates();
    this.props.navigation.navigate('RegisteredScreen');
  };

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{width: '100%'}}>
          <View
            style={{
              width: '100%',
              height: 180,
            }}></View>

          <Image
            source={require('../../assets/background.png')}
            style={{
              width: '95%',
              height: 135,
              resizeMode: 'contain',
              position: 'absolute',
              right: 0,
              top: 23,
            }}
          />
          <View
            style={{
              width: '100%',
              height: 152,
              resizeMode: 'contain',
              position: 'absolute',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                left: 10,
                top: 23,
                zIndex: 100,
              }}
              onPress={() => this.goToRegistredScreen()}>
              <ArrowGrayComponent />
            </TouchableOpacity>
            <Text
              style={{
                position: 'absolute',
                color: '#2D9EFB',
                fontSize: 36,
                left: 19,
                top: 130,
                fontFamily: 'Poppins_500Medium',
              }}>
              Регистрация
            </Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            width: '100%',
          }}
          ref={this.ref}>
          <View style={{paddingHorizontal: 25}}>
            <View>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.company_name_error
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                Название*
              </Text>
              <TextInput
                underlineColorAndroid="transparent"
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  },
                  this.state.company_name_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                value={this.state.company_name}
                onChangeText={value => {
                  this.setState({
                    company_name: value,
                    company_name_error: false,
                  });
                }}
              />
              {this.state.name_exists_error && (
                <Text
                  style={[
                    {
                      fontFamily: 'Poppins_500Medium',
                      lineHeight: 23,
                      fontSize: 13,
                      // color: "#5B5B5B",
                      marginTop: 10,
                      marginBottom: 5,
                      color: 'red',
                    },
                  ]}>
                  Производитель с таким именем уже существует.
                </Text>
              )}
            </View>

            <View>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.individual_number_error
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                ИНН
              </Text>
              <TextInput
                underlineColorAndroid="transparent"
                keyboardType="phone-pad"
                maxLength={12}
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  },
                  this.state.individual_number_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                value={this.state.individual_number}
                onChangeText={value => {
                  this.setState({
                    individual_number: value,
                    individual_number_error: false,
                  });
                }}
              />
            </View>

            <View>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    color: '#5B5B5B',
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.phone_error || this.state.phone_exist
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                  this.state.phone_exist && {fontSize: 13},
                ]}>
                {this.state.phone_exist
                  ? 'Этот телефонный номер уже зарегистрирован за другим пользователем'
                  : `Номер телефона*`}

                {!this.state.phone_exist && (
                  <Text
                    style={{fontSize: 12}}>{`   (придёт звонок с кодом)`}</Text>
                )}
              </Text>

              <MaskInput
                underlineColorAndroid="transparent"
                keyboardType="phone-pad"
                placeholder="+7 (975) 991-99-99"
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  },
                  this.state.phone_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                mask={[
                  '+',
                  '7',
                  ' ',
                  '(',
                  /\d/,
                  /\d/,
                  /\d/,
                  ')',
                  ' ',
                  /\d/,
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                ]}
                value={this.state.phone}
                onChangeText={masked => {
                  this.setState({
                    value_length: masked,
                    phone: masked,
                    phone_error: false,
                    phone_exist: false,
                  });
                }}
              />
            </View>

            <View>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.watsap_phone_error
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                Номер Whatsapp-для запроса стоимости*
              </Text>
              <MaskInput
                underlineColorAndroid="transparent"
                keyboardType="phone-pad"
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  },
                  this.state.watsap_phone_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                placeholder="+7 (975) 991-99-99"
                mask={[
                  '+',
                  '7',
                  ' ',
                  '(',
                  /\d/,
                  /\d/,
                  /\d/,
                  ')',
                  ' ',
                  /\d/,
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                ]}
                value={this.state.watsap_phone}
                onChangeText={value => {
                  this.setState({
                    watsap_phone: value,
                    watsap_phone_error: false,
                  });
                }}
              />
            </View>

            <View
              style={{
                position: 'relative',
                // marginTop: 9,
              }}>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.made_in_error
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                Страна производства*
              </Text>
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                    position: 'relative',
                  },
                  this.state.made_in_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                onPress={() => {
                  if (this.state.made_in_select === false) {
                    this.getCountry();
                  } else {
                    this.setState({made_in_select: false});
                  }
                }}>
                <Text
                  style={{
                    padding: 5,
                    width: '100%',
                    borderRadius: 5,
                    // fontFamily: 'Poppins_500Medium',
                    color: '#5B5B5B',
                  }}>
                  {this.state.made_in}
                </Text>
                <View style={{position: 'absolute', right: 17, bottom: 18}}>
                  {!this.state.made_in_select && (
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
                  {this.state.made_in_select && (
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
                  this.state.made_in_select
                    ? styles.sOpenCityDropDownActive
                    : styles.sOpenCityDropDown
                }>
                <ScrollView nestedScrollEnabled={true}>
                  {this.state.made_in_array.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          textAlign: 'left',
                        }}
                        onPress={async () => {
                          await this.setState({
                            made_in: item.nicename,
                            made_in_select: false,
                          });
                        }}>
                        <Text
                          style={[
                            {
                              textAlign: 'left',
                              paddingVertical: 7,
                              fontFamily: 'Poppins_500Medium',
                              borderBottomWidth: 1,
                              borderBottomColor: '#F5F5F5',
                            },
                          ]}>
                          {item.nicename}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {/* categoryButtons start */}
            {/* {this.state.product_category.length == 0 && <View></View>}
            {this.state.product_category.length !== 0 && (
              <View
                style={{
                  marginTop: 27,
                  height: 50,
                }}
              >
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.product_category.map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          position: "relative",
                          marginRight: 10,
                          marginTop: 10,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            backgroundColor: "#F5F5F5",
                            fontFamily: "Poppins_500Medium",
                          }}
                        >
                          {item.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.verifyCategory(item);
                          }}
                          style={{
                            position: "absolute",
                            right: -5,
                            top: -5,
                            // borderWidth: 1,
                          }}
                        >
                          <Image
                            source={require("../../assets/image/ixs.png")}
                            style={{
                              width: 12,
                              height: 12,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )} */}
            {/* categoryButtons end */}

            {/* dropDown  start*/}

            {/* <View
              style={{
                position: "relative",
                // marginTop: 9,
              }}
            >
              <Text
                style={[
                  {
                    fontFamily: "Poppins_500Medium",
                    lineHeight: 23,
                    fontSize: 15,
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.product_category_error
                    ? { color: "red" }
                    : { color: "#5B5B5B" },
                ]}
              >
                Категория продукции*
              </Text>
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: "100%",
                    borderRadius: 5,
                    position: "relative",
                  },
                  this.state.product_category_error
                    ? { borderColor: "red" }
                    : { borderColor: "#F5F5F5" },
                ]}
                onPress={() =>
                  this.setState({
                    sOpenCityDropDown: !this.state.sOpenCityDropDown,
                    product_category_error: false,
                  })
                }
              >
                <Text
                  style={{
                    padding: 5,
                    width: "100%",
                    borderRadius: 5,
                    // fontFamily: 'Poppins_500Medium',
                    color: "#5B5B5B",
                  }}
                >
                  указанное количество {this.state.count}
                </Text>
                 <View style={{ position: "absolute", right: 17, bottom: 18 }}>
                  {!this.state.sOpenCityDropDown && (
                    <Svg
                      width="18"
                      height="10"
                      viewBox="0 0 18 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <Path
                        d="M1 1L9 9L17 1"
                        stroke="#888888"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </Svg>
                  )}
                  {this.state.sOpenCityDropDown && (
                    <Svg
                      width="18"
                      height="10"
                      viewBox="0 0 18 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
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
                  this.state.sOpenCityDropDown
                    ? styles.sOpenCityDropDownActive
                    : styles.sOpenCityDropDown
                }
              >
                <ScrollView nestedScrollEnabled={true}>
                  {this.state.getProductCategory.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          textAlign: "left",
                        }}
                        onPress={() => {
                          this.getCategory(item.name, item.id);
                        }}
                      >
                        <Text
                          style={[
                            {
                              textAlign: "left",
                              paddingVertical: 7,
                              fontFamily: "Poppins_500Medium",
                              borderBottomWidth: 1,
                              borderBottomColor: "#F5F5F5",
                            },
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View> */}

            {/* cityButons start */}
            {this.state.sales_city.length == 0 && <View></View>}
            {this.state.sales_city.length !== 0 && (
              <View
                style={{
                  marginTop: 27,
                  height: 50,
                }}>
                {this.state.allCities ? (
                  <View
                    style={{
                      position: 'relative',
                      marginRight: 10,
                      marginTop: 10,
                      borderRadius: 8,
                    }}>
                    <Text
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        backgroundColor: '#F5F5F5',
                        fontFamily: 'Poppins_500Medium',
                      }}>
                      Все города России
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          allCities: false,
                          sales_city: [],
                          countCity: 0,
                        });
                        // this.verifyGorod(item);
                      }}
                      style={{
                        position: 'absolute',
                        right: -5,
                        top: -5,
                        // borderWidth: 1,
                      }}>
                      <Image
                        source={require('../../assets/image/ixs.png')}
                        style={{
                          width: 12,
                          height: 12,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {this.state.sales_city.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            position: 'relative',
                            marginRight: 10,
                            marginTop: 10,
                            borderRadius: 8,
                          }}>
                          <Text
                            style={{
                              paddingHorizontal: 16,
                              paddingVertical: 10,
                              backgroundColor: '#F5F5F5',
                              fontFamily: 'Poppins_500Medium',
                            }}>
                            {item.name}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              this.verifyGorod(item);
                            }}
                            style={{
                              position: 'absolute',
                              right: -5,
                              top: -5,
                              // borderWidth: 1,
                            }}>
                            <Image
                              source={require('../../assets/image/ixs.png')}
                              style={{
                                width: 12,
                                height: 12,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            )}
            {/* cityButons end */}

            {/* dropDown city start*/}

            <View
              style={{
                position: 'relative',
              }}>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.sales_city_error
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                Города (продажи продукции)*
              </Text>
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                    position: 'relative',
                  },
                  this.state.sales_city_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                onPress={() => {
                  this.getCityApi();
                }}>
                <Text
                  style={{
                    padding: 5,
                    width: '100%',
                    borderRadius: 5,
                    color: '#5B5B5B',
                  }}>
                  указанное количество {this.state.countCity}
                </Text>
                <View style={{position: 'absolute', right: 17, bottom: 18}}>
                  {!this.state.sOpenCityDropDown3 && (
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
                  {this.state.sOpenCityDropDown3 && (
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
                  this.state.sOpenCityDropDown3
                    ? styles.sOpenCityDropDownActive
                    : styles.sOpenCityDropDown
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
                          this.gorod(item.name, item.id);
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

            <View>
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  lineHeight: 23,
                  fontSize: 15,
                  color: '#5B5B5B',
                  marginTop: 27,
                  marginBottom: 5,
                }}>
                Сайт с ассортиментом компании
              </Text>

              <TextInput
                underlineColorAndroid="transparent"
                placeholder="https://mymebelsite.com"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: '#F5F5F5',
                  padding: 10,
                  width: '100%',
                  borderRadius: 5,
                }}
                value={this.state.saite}
                onChangeText={text => {
                  if (
                    text == 'https://' ||
                    text == 'https:/' ||
                    text == 'https:' ||
                    text == 'https' ||
                    text == 'http' ||
                    text == 'htt' ||
                    text == 'ht' ||
                    text == 'h'
                  ) {
                    text = 'https://';
                    this.setState({saite: text});
                  } else {
                    let new_text = text.replace('https://', '');

                    this.setState({saite: `https://${new_text}`});
                  }
                }}
              />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  lineHeight: 23,
                  fontSize: 15,
                  color: '#5B5B5B',
                  marginTop: 27,
                  marginBottom: 5,
                }}>
                Телеграм канал
              </Text>

              <TextInput
                placeholder="MyTelegramChennel"
                underlineColorAndroid="transparent"
                style={{
                  borderWidth: 1,
                  borderColor: '#F5F5F5',
                  padding: 10,
                  width: '100%',
                  borderRadius: 5,
                }}
                value={this.state.telegram}
                onChangeText={text => {
                  if (
                    text == 't.me/' ||
                    text == 't.me' ||
                    text == 't.m' ||
                    text == 't.' ||
                    text == 't'
                  ) {
                    text = 't.me/';
                    this.setState({telegram: text});
                  } else {
                    let new_text = text.replace('t.me/', '');

                    this.setState({telegram: `t.me/${new_text}`});
                  }
                }}
              />
            </View>

            <View>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.password_error
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                Пароль (минимум 6 символов)*
              </Text>
              <TextInput
                underlineColorAndroid="transparent"
                secureTextEntry={true}
                password={true}
                autoCorrect={false}
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  },
                  this.state.password_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                value={this.state.password}
                onChangeText={value => {
                  this.setState({password: value, password_error: false});
                }}
              />
            </View>

            <View>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.password_confirmation_error
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                Повторите пароль*
              </Text>
              <TextInput
                underlineColorAndroid="transparent"
                secureTextEntry={true}
                password={true}
                autoCorrect={false}
                style={[
                  {
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  },
                  this.state.password_confirmation_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                value={this.state.password_confirmation}
                onChangeText={value => {
                  this.setState({
                    password_confirmation: value,
                    password_confirmation_error: false,
                  });
                }}
              />
            </View>

            {/* dropDown  start*/}

            <View
              style={{
                position: 'relative',
                // marginTop: 9,
              }}>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    color: '#5B5B5B',
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  this.state.show_room_error
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                Наличие шоурума
              </Text>
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderColor: '#000',
                    borderRadius: 5,
                    position: 'relative',
                  },
                  this.state.show_room_error
                    ? {borderColor: 'red'}
                    : {borderColor: '#F5F5F5'},
                ]}
                onPress={() =>
                  this.setState({
                    sOpenCityDropDown1: !this.state.sOpenCityDropDown1,
                  })
                }>
                <Text
                  style={{
                    padding: 5,
                    width: '100%',
                    borderRadius: 5,
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  {this.state.show_room}
                </Text>
                <View style={{position: 'absolute', right: 17, bottom: 18}}>
                  {!this.state.sOpenCityDropDown1 && (
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
                  {this.state.sOpenCityDropDown1 && (
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
                  this.state.sOpenCityDropDown1
                    ? styles.daNetActive
                    : styles.daNet
                }>
                <ScrollView nestedScrollEnabled={true}>
                  {this.state.show_room_arr.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          textAlign: 'left',
                          borderBottomWidth: 1,
                          borderBottomColor: '#F5F5F5',
                        }}
                        onPress={() =>
                          this.setState({
                            show_room: item.name,
                            sOpenCityDropDown1: false,
                          })
                        }>
                        <Text
                          style={{
                            textAlign: 'left',
                            paddingVertical: 10,
                            fontFamily: 'Poppins_500Medium',
                            color: '#888888',
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            {/* dropDown  end*/}

            <View
              style={{
                position: 'relative',
              }}>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    color: '#5B5B5B',
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  {color: '#5B5B5B'},
                ]}>
                Сотрудничаете с дизайнерами?
              </Text>
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderColor: '#000',
                    borderRadius: 5,
                    position: 'relative',
                  },
                  {borderColor: '#F5F5F5'},
                ]}
                onPress={() =>
                  this.setState({
                    sOpenCityDropDown4: !this.state.sOpenCityDropDown4,
                  })
                }>
                <Text
                  style={{
                    padding: 5,
                    width: '100%',
                    borderRadius: 5,
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  {this.state.collaborate}
                </Text>
                <View style={{position: 'absolute', right: 17, bottom: 18}}>
                  {!this.state.sOpenCityDropDown4 && (
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
                  {this.state.sOpenCityDropDown4 && (
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
                  this.state.sOpenCityDropDown4
                    ? styles.daNetActive
                    : styles.daNet
                }>
                <ScrollView nestedScrollEnabled={true}>
                  {this.state.show_room_arr.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          textAlign: 'left',
                          borderBottomWidth: 1,
                          borderBottomColor: '#F5F5F5',
                        }}
                        onPress={() =>
                          this.setState({
                            collaborate: item.name,
                            sOpenCityDropDown4: false,
                          })
                        }>
                        <Text
                          style={{
                            textAlign: 'left',
                            paddingVertical: 10,
                            fontFamily: 'Poppins_500Medium',
                            color: '#888888',
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View
              style={{
                position: 'relative',
              }}>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    color: '#5B5B5B',
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  {color: '#5B5B5B'},
                ]}>
                Предоставляете 3d модели ?
              </Text>
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderColor: '#000',
                    borderRadius: 5,
                    position: 'relative',
                  },
                  {borderColor: '#F5F5F5'},
                ]}
                onPress={() =>
                  this.setState({
                    sOpenCityDropDown5: !this.state.sOpenCityDropDown5,
                  })
                }>
                <Text
                  style={{
                    padding: 5,
                    width: '100%',
                    borderRadius: 5,
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  {this.state.d3model}
                </Text>
                <View style={{position: 'absolute', right: 17, bottom: 18}}>
                  {!this.state.sOpenCityDropDown5 && (
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
                  {this.state.sOpenCityDropDown5 && (
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
                  this.state.sOpenCityDropDown5
                    ? styles.daNetActive
                    : styles.daNet
                }>
                <ScrollView nestedScrollEnabled={true}>
                  {this.state.show_room_arr.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          textAlign: 'left',
                          borderBottomWidth: 1,
                          borderBottomColor: '#F5F5F5',
                        }}
                        onPress={() =>
                          this.setState({
                            d3model: item.name,
                            sOpenCityDropDown5: false,
                          })
                        }>
                        <Text
                          style={{
                            textAlign: 'left',
                            paddingVertical: 10,
                            fontFamily: 'Poppins_500Medium',
                            color: '#888888',
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View>
              <Text
                style={[
                  {
                    color: '#5B5B5B',
                    fontSize: 15,
                    lineHeight: 18,
                    marginTop: 27,
                    fontFamily: 'Poppins_500Medium',
                  },
                  this.state.logo_error === true
                    ? {color: 'red'}
                    : {color: '#5B5B5B'},
                ]}>
                Загрузите аватар/логотип*
              </Text>
            </View>

            <View
              style={{
                marginTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  this.state.logo_error
                    ? {backgroundColor: 'red'}
                    : {backgroundColor: '#B5D8FE'},
                ]}
                onPress={() => this.pickImage()}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 15,
                    fontWeight: '700',
                    marginBottom: 2,
                    textAlign: 'center',
                  }}>
                  Загрузить
                </Text>
              </TouchableOpacity>
              {this.state.logo === null && <></>}
              {this.state.logo !== null && this.state.logo_error === false && (
                <Image
                  source={require('../../assets/image/changed.png')}
                  style={{width: 32, height: 32}}
                />
              )}
            </View>

            {/* <Text
              style={[
                {
                  fontFamily: "Poppins_500Medium",
                  lineHeight: 23,
                  fontSize: 15,
                  color: "#5B5B5B",
                  marginTop: 27,
                  marginBottom: 5,
                },
                { color: "#5B5B5B" },
              ]}
            >
              Дополнительная информация
            </Text>
            <RichTextEditorComponent onChange={(value) => this.setState({ dopInfo: value })} value={this.state.dopInfo} /> */}
            <View style={styles.checkBox}>
              <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => {
                  this.setState({i_agree: !this.state.i_agree});
                }}>
                <View>
                  {this.state.i_agree === false &&
                    this.state.i_agree_error === false && (
                      <Svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Rect
                          x="1"
                          y="1"
                          width="26"
                          height="26"
                          rx="3"
                          stroke="#B5D8FE"
                          stroke-width="2"
                        />
                      </Svg>
                    )}
                  {this.state.i_agree_error === true &&
                    this.state.i_agree !== true && (
                      <Svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Rect
                          x="1"
                          y="1"
                          width="26"
                          height="26"
                          rx="3"
                          stroke="red"
                          stroke-width="2"
                        />
                      </Svg>
                    )}
                  {this.state.i_agree === true && (
                    <Svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Rect width="28" height="28" rx="4" fill="#B5D8FE" />
                      <Path
                        d="M7 15L11.4118 20L22 7"
                        stroke="white"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </Svg>
                  )}
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  color: '#888888',
                  fontSize: 12,
                  fontFamily: 'Poppins_400Regular',
                }}>
                Согласен с правилами
                <Text
                  style={{
                    fontFamily: 'Poppins_700Bold',
                  }}>
                  {' '}
                  приложения
                </Text>{' '}
                и {'\n'}
                <Text
                  style={{
                    fontFamily: 'Poppins_700Bold',
                  }}>
                  политикой конфиденциальности
                </Text>
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                width: '100%',
                flexDirection: 'row',
                marginBottom: 220,
              }}>
              <TouchableOpacity
                style={{
                  marginVertical: 25,
                }}
                onPress={async () => {
                  if (
                    this.state.value_length.length < 18 &&
                    this.state.value_length !== ''
                  ) {
                    this.setState({phone_error: true});
                  } else {
                    await this.getMainApi();
                  }
                }}>
                <BlueButton name="Зарегистрироваться" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  modalInfoContainer: {
    width: '90%',
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 20,
    position: 'relative',
  },
  bluePercent: {
    color: '#2D9EFB',
  },
  button: {
    width: 111,
    height: 40,
    alignItems: 'center',
    borderRadius: 8,
    // lineHeight: 18,
    justifyContent: 'center',
  },
  checkBox: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  DesignerRemunerationPercentageParent: {
    width: '100%',
    // paddingHorizontal: 25
  },
  DesignerRemunerationPercentage: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  procentText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#888888',
  },
  procentInput: {
    borderWidth: 1,
    borderColor: '#F5F5F5',
    borderRadius: 6,
    width: '23%',
    height: '100%',
    paddingLeft: 5,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#888888',
    marginRight: 10,
  },
  rubli: {
    height: '100%',
    width: 21,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#888888',
    marginRight: 5,
  },
  procent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    borderRadius: 6,
    width: 45,
    height: '100%',
    paddingLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#888888',
  },
  presoble: {
    width: 90,
    height: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  sOpenCityDropDown: {
    width: '100%',
    height: 0,
    zIndex: 100,
  },
  sOpenCityDropDownActive: {
    width: '100%',
    height: 120,
    elevation: 2,
    borderColor: '#F5F5F5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 100,
    backgroundColor: '#fff',
  },
  daNet: {
    width: '100%',
    height: 0,
    zIndex: 100,
  },
  daNetActive: {
    width: '100%',
    height: 100,
    elevation: 2,
    borderColor: '#F5F5F5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 100,
    backgroundColor: '#fff',
  },
});
