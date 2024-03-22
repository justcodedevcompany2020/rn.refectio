import React from 'react';
import {
  Image,
  ImageBackground,
  Keyboard,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Path} from 'react-native-svg';
import ArrowGrayComponent from '../../assets/image/ArrowGray';
import {AuthContext} from '../AuthContext/context';
import BlueButton from '../Component/Buttons/BlueButton';
import CustomerMainPageNavComponent from './CustomerMainPageNav';
// import * as ImagePicker from "expo-image-picker";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HTML from 'react-native-render-html';

export default class CustomerMyAccauntComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardOpen: false,

      categoryModal: false,
      categoryArray: [],
      categoryItems: [],
      categoryFilter: false,
      category_empty_error: false,
      category_empty_error_text: '',

      gorodModal: false,
      gorodArray: [],
      gorodFilter: false,

      cityItems: [],

      editUserDataModal: false,

      authUserState: [],

      id: null,
      inn: '',
      strana: '',

      editModal: false,
      editModalInn: false,

      made_in_array: [],
      made_in_select: false,
      made_in: '',
      made_in_error: false,

      individual_number: '',

      phone: '',

      RewardModal: false,

      urlImage: `https://admin.refectio.ru/storage/app/uploads/`,

      logo: '',
      companyName: '',
      site: '',
      teleg: '',

      valid_error: false,

      allCities: false,

      procentArray: [
        {
          start_price: '0',
          before_price: 'datark',
          percent: '',
        },
      ],

      delate_category: false,

      delate_accaunt: false,

      arrItems: [
        {name: 'Да', id: 1},
        {name: 'Нет', id: 2},
      ],

      collaborate: '',
      dmodel: '',
      openDesignerPopup: false,
      dmodelPopup: false,
      about_us: '',
      updatedAboutUs: '',
      // aboutUsModal: false
    };
  }
  static contextType = AuthContext;

  getCityApi = async () => {
    console.log('aa');
    this.setState({
      gorodModal: true,
    });

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
        console.log(res, 'l');
        if (res.status === true) {
          this.setState({sOpenCityDropDown3: !this.state.sOpenCityDropDown3});
        }
        this.setState({
          cityItems: [{name: 'Все города России', id: 9999}, ...res.data.city],
        });
        // console.log(this.state.cityItems, 'city');
      });
  };

  updatedCities = async () => {
    let gorodArraySort = this.state.gorodArray;

    if (gorodArraySort.length == 0) {
      this.setState({
        cities_empty_error: true,
        cities_empty_error_text: 'Выберите город!',
      });
      return false;
    } else {
      this.setState({
        cities_empty_error: false,
        cities_empty_error_text: '',
      });
    }

    let new_gorod_sort = [];
    for (let i = 0; i < gorodArraySort.length; i++) {
      let city = gorodArraySort[i].city_id + '^' + gorodArraySort[i].city_name;
      new_gorod_sort.push(city);
    }

    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;

    myHeaders.append('Authorization', AuthStr);

    let formdata = new FormData();
    formdata.append('sales_city[]', new_gorod_sort);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    fetch(
      `https://admin.refectio.ru/public/api/UpdategorodaProdaji`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === true) {
          this.getAuthUserProfile();
          this.setState({
            gorodModal: false,
            gorodFilter: false,
          });
        }
      })
      .catch(error => console.log('error', error));

    // ete succesy true ya kanchumenq getAuthUserProfile es funkcian u pagumenq popapy
  };

  getAllCategory = async () => {
    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    await fetch(
      `https://admin.refectio.ru/public/api/GetProductCategory`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        this.setState({categoryItems: result.data.city});
      })
      .catch(error => console.log('error', error));
  };

  getCountry = async () => {
    await this.setState({editModal: true});

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
        this.setState({made_in_array: result.data});
      })
      .catch(error => console.log('error', error));
  };

  updateCategory = async () => {
    let categoryArraySort = this.state.categoryArray;

    if (categoryArraySort.length == 0) {
      this.setState({
        category_empty_error: true,
        category_empty_error_text: 'Выберите Категории!',
      });
      return false;
    } else {
      this.setState({
        category_empty_error: false,
        category_empty_error_text: '',
      });
    }

    let new_category_sort = [];
    for (let i = 0; i < categoryArraySort.length; i++) {
      let city =
        categoryArraySort[i].category_id +
        '^' +
        categoryArraySort[i].category_name;
      new_category_sort.push(city);
    }

    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;

    myHeaders.append('Authorization', AuthStr);

    let formdata = new FormData();
    formdata.append('product_category[]', new_category_sort);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    fetch(
      `https://admin.refectio.ru/public/api/UpdateCategoryProizvoditel`,
      requestOptions,
    )
      .then(response => response.json())
      .then(async result => {
        if (result.status === true) {
          this.getAuthUserProfile();
          await this.setState({
            categoryModal: false,
            categoryFilter: false,
          });
        }
      })
      .catch(error => console.log('error', error));

    // ete succesy true ya kanchumenq getAuthUserProfile es funkcian u pagumenq popapy
  };

  getAuthUserProfile = async () => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);
    myHeaders.append('Content-Type', 'multipart/form-data');
    await fetch(`https://admin.refectio.ru/public/api/AuthUserProfile`, {
      method: 'GET',
      headers: myHeaders,
    })
      .then(response => response.json())
      .then(res => {
        this.setState({
          about_us: res?.data[0].about_us,
          updatedAboutUs: res?.data[0].about_us,
          authUserState: res?.data,
          gorodArray: res?.data[0].city_of_sales_manufacturer,
          allCities:
            res?.data[0].city_of_sales_manufacturer.length == res?.city_count
              ? true
              : false,
          id: res?.data[0].id,
          inn: res?.data[0].individual_number,
          strana: res?.data[0].made_in,
          phone: res?.data[0].phone,
          procentArray: res?.data[0].user_pracient_for_designer,
          categoryArray: res?.data[0].user_category_product,
          logo: res?.data[0].logo,
          companyName: res?.data[0].company_name,
          site:
            res?.data[0].saite !== 'null' && res?.data[0].saite !== null
              ? 'https://' + res?.data[0].saite
              : '',
          teleg:
            res?.data[0].telegram !== null
              ? 't.me/' + res?.data[0].telegram
              : 't.me/',
          collaborate: res?.data[0].job_with_designer,
          dmodel: res?.data[0].dmodel,
        });
      });
  };

  sendMadeIn = async () => {
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'multipart/form-data');
    myHeaders.append('Authorization', AuthStr);

    let formdata = new FormData();
    formdata.append('made_in', this.state.made_in);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    await fetch(
      `https://admin.refectio.ru/public/api/updateManeInProizvoditel`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === true) {
          this.setState({
            editModal: false,
            strana: this.state.made_in,
          });
        }
      })
      .catch(error => console.log('error', error));
  };

  sendInn = async () => {
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'multipart/form-data');
    myHeaders.append('Authorization', AuthStr);

    let formdata = new FormData();
    formdata.append('individual_number', this.state.individual_number);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    await fetch(
      `https://admin.refectio.ru/public/api/UpdateIndividualNumberProizvoditel`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === true) {
          this.getAuthUserProfile();
        }
      })
      .catch(error => console.log('error', error));
  };

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
      start_price: 'datark',
      before_price: 'datark',
      percent: '',
    });
    let newProcentArray = procentArray;

    this.setState({
      procentArray: newProcentArray,
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
        procentArray[i].start_price +
        '^' +
        procentArray[i].before_price +
        '^' +
        procentArray[i].percent;
      result.push(resultString);
    }

    if (valid_error) {
      this.setState({
        valid_error: true,
      });

      setTimeout(() => {
        this.setState({
          valid_error: false,
        });
      }, 2000);
    } else {
      let myHeaders = new Headers();
      let userToken = await AsyncStorage.getItem('userToken');
      let AuthStr = 'Bearer ' + userToken;
      myHeaders.append('Content-Type', 'multipart/form-data');
      myHeaders.append('Authorization', AuthStr);

      let formdata = new FormData();
      formdata.append('percent_bonus[]', result);

      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `https://admin.refectio.ru/public/api/UpdatePracentForDesigner`,
        requestOptions,
      )
        .then(response => response.json())
        .then(res => {
          if (res.status === true) {
            this.getAuthUserProfile();
            this.setState({RewardModal: false});
          }
        })
        .catch(error => console.log('error', error));
    }
  };

  changeTo = (value, index) => {
    let {procentArray} = this.state;

    let without_dots = value.split('.').join('');
    let with_dots = without_dots
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    procentArray[index].start_price = with_dots;

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

    procentArray[index].before_price = with_dots;

    this.setState({
      procentArray: procentArray,
    });
  };

  changePercent = (value, index) => {
    let {procentArray} = this.state;

    procentArray[index].percent = value;

    this.setState({
      procentArray: procentArray,
    });
  };

  componentDidMount() {
    const {navigation} = this.props;
    // this.getAuthUserProfile();

    this.focusListener = navigation.addListener('focus', () => {
      this.getAuthUserProfile();
    });

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

  // gorod startttttttttt

  enterCheckBox = (items, index) => {
    let filterSort = this.state.gorodArray;
    let find = false;

    items.city_id = items.id;
    items.city_name = items.name;

    if (items.city_id === 9999) {
      filterSort = this.state.cityItems
        .filter(el => el.id !== 9999)
        .map(item => ({city_name: item.name, city_id: item.id}));
      this.setState({
        allCities: true,
        countCity: this.state.cityItems.length - 1,
      });
    } else {
      find = filterSort.some(item => item.city_id === items.city_id);
      if (!find) {
        filterSort = [
          ...filterSort,
          {city_name: items.name, city_id: items.city_id},
        ];
        this.setState(prevState => ({countCity: prevState.countCity + 1}));
      }
    }

    this.setState({gorodArray: filterSort});
  };
  // enterCheckBox = (items, index) => {
  //   let filterSort = this.state.gorodArray;
  //   let find = true;

  //   items.city_id = items.id;
  //   items.city_name = items.name;

  //   if (items.city_id == 9999) {
  //     filterSort = this.state.cityItems
  //       .filter(el => el.id !== 9999)
  //       .map((item, i) => ({city_name: item.name, city_id: item.id}));
  //     this.setState({
  //       allCities: true,
  //       countCity: this.state.cityItems.length - 1,
  //     });
  //   } else {
  //     filterSort.find(item => {
  //       if (item.id == items.city_id) {
  //         find = false;
  //       }
  //     });
  //     if (find) {
  //       filterSort.push({city_name: items.name, city_id: items.city_id});
  //       this.setState({countCity: this.state.countCity + 1});
  //     }
  //   }

  //   this.setState({gorodArray: filterSort});
  // };

  verifyCheckBox = items => {
    let filterSort = this.state.gorodArray;
    let find = false;
    filterSort.find(item => {
      if (item == items) {
        find = true;
      }
    });

    if (find) {
      const index = filterSort.indexOf(items);
      filterSort.splice(index, 1);
    }
    this.setState({gorodArray: filterSort});
  };

  categoryAdd = async (items, index) => {
    items.category_name = items.name;
    items.category_id = items.id;

    let filterSort = this.state.categoryArray;

    let find = true;
    filterSort.find(item => {
      if (item.category_id == items.category_id) {
        find = false;
      }
    });
    if (find) {
      filterSort.push(items);
    }

    await this.setState({categoryArray: filterSort});
  };

  categoryDelate = async items => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);
    await fetch(
      `https://admin.refectio.ru/public/api/validationcategoryId/category_id=${items.category_id}`,
      {
        headers: myHeaders,
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(async result => {
        if (
          result.status === false &&
          result.message ===
            'Нельзя удалить заполненную категорию. Сначала удалите объекты в разделе Продукция по данной категории'
        ) {
          this.setState({delate_category: true});
          setTimeout(() => {
            this.setState({delate_category: false});
          }, 4000);
        } else {
          let filterSort = this.state.categoryArray;
          let find = false;
          filterSort.find(item => {
            if (item == items) {
              find = true;
            }
          });

          if (find) {
            const index = filterSort.indexOf(items);
            filterSort.splice(index, 1);
          }
          await this.setState({categoryArray: filterSort});
        }
      })
      .catch(err => console.log(err, 'err'));
  };

  editNameCompany = async () => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);

    let formdata = new FormData();
    formdata.append('company_name', this.state.companyName);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/updateProfileCompanyName`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        this.getAuthUserProfile();
      })
      .catch(error => console.log('error', error));
  };

  editSite = async () => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);

    let saite = this.state.site.replace('https://', '');

    if (saite === '') {
      saite = null;
    }

    let formdata = new FormData();
    formdata.append('saite', saite);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/updateSaiteProizvaditel`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        this.getAuthUserProfile();
      })
      .catch(error => console.log('error', error));
  };

  editTeleg = async () => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);

    let telegram = this.state.teleg.replace('t.me/', '');

    let formdata = new FormData();
    formdata.append('telegram', telegram);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/UpdateTelegramChanel`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        this.getAuthUserProfile();
      })
      .catch(error => console.log('error', error));
  };

  pickImage = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 4],
    //   quality: 1,
    // });
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

    if (!result.canceled) {
      this.setState({logo: result.path});
    }

    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);

    let formdata = new FormData();

    formdata.append('logo', {
      uri: result.path,
      type: 'image/jpg',
      name: 'photo.jpg',
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/updateLogoProizvoditel`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === true) {
          this.getAuthUserProfile();
        }
      })
      .catch(error => console.log('error', error));
  };

  logouth = async () => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let userRole = await AsyncStorage.getItem('userRole');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);

    // await this.setState({
    //   userToken: userToken,
    //   role_id:
    // })

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`https://admin.refectio.ru/public/api/UserLogout`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === true) {
          let foundUser = {
            userToken: userToken,
            userRole: userRole,
          };
          this.context.signOut(foundUser);
        }
      })
      .catch(error => console.log('error', error));
  };

  delateAccaunt = async () => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;

    myHeaders.append('Authorization', AuthStr);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/deleteMyAccount`,
      requestOptions,
    )
      .then(response => response.json())
      .then(async result => {
        if (result.status === true && result.message === 'Account Deleted') {
          await this.logouth();
          await this.setState({delate_accaunt: false});
        }
      });
  };

  update_dmodel = async value => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);

    let formdata = new FormData();
    formdata.append('dmodel', value);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`https://admin.refectio.ru/public/api/update_dmodel`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(error => console.log('error', error));
  };

  update_job_with_designer = async value => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);

    let formdata = new FormData();
    formdata.append('job_with_designer', value);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/update_job_with_designer`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(error => console.log('error', error));
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.main}>
          <Modal visible={this.state.gorodModal}>
            <ImageBackground
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../../assets/image/blurBg.png')}>
              <View
                style={{
                  width: '90%',
                  height: '90%',
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  position: 'relative',
                  paddingHorizontal: 15,
                }}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 18,
                    top: 18,
                  }}
                  onPress={async () => {
                    await this.getAuthUserProfile();
                    await this.setState({gorodModal: false});
                  }}>
                  <Image
                    source={require('../../assets/image/ixs.png')}
                    style={{
                      width: 22.5,
                      height: 22.5,
                    }}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    marginTop: 70,
                    fontSize: 26,
                    textAlign: 'center',
                    color: '#2D9EFB',
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  Города
                </Text>
                <View
                  style={{
                    marginTop: 41,
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
                            gorodArray: [],
                            countCity: 0,
                          });
                        }}
                        style={{
                          position: 'absolute',
                          right: -5,
                          top: -5,
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
                      {this.state.gorodArray.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              position: 'relative',
                              marginRight: 10,
                              marginTop: 10,
                            }}>
                            <Text
                              style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                backgroundColor: '#F5F5F5',
                                borderRadius: 8,
                                fontFamily: 'Poppins_500Medium',
                              }}>
                              {item.city_name}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                this.verifyCheckBox(item);
                              }}
                              style={{
                                position: 'absolute',
                                right: -5,
                                top: -5,
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

                {/* gorod dropDown start */}
                <View style={styles.gorodFilter}>
                  <View
                    style={{
                      flexDirection: 'row',
                      position: 'relative',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: '#F5F5F5',
                        padding: 10,
                        width: '100%',
                        borderRadius: 6,
                        position: 'relative',
                        height: 45,
                        marginRight: 12,
                      }}
                      onPress={() =>
                        this.setState({gorodFilter: !this.state.gorodFilter})
                      }>
                      <Text
                        style={{
                          color: '#000',
                          fontFamily: 'Poppins_500Medium',
                        }}>
                        Города
                      </Text>
                      <View
                        style={{position: 'absolute', right: 17, bottom: 18}}>
                        {!this.state.gorodFilter && (
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
                        {this.state.gorodFilter && (
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
                  </View>
                  <View
                    style={
                      this.state.gorodFilter
                        ? styles.setGorodFilterActive
                        : styles.setGorodFilter
                    }>
                    <ScrollView nestedScrollEnabled={true}>
                      {this.state.cityItems.map((item, index) => {
                        // console.log(item, 'irteemm');
                        return (
                          <TouchableOpacity
                            key={index}
                            style={{
                              width: '100%',
                              justifyContent: 'space-between',
                              textAlign: 'left',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                            onPress={() => {
                              this.enterCheckBox(item, index);
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
                {/* gorod dropdown end */}

                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    position: 'absolute',
                    bottom: '20%',
                  }}
                  onPress={() => this.updatedCities()}>
                  <BlueButton name="Сохранить" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal>

          <Modal visible={this.state.editModal}>
            <ImageBackground
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../../assets/image/blurBg.png')}>
              <View
                style={{
                  width: '90%',
                  height: 400,
                  borderRadius: 20,
                  paddingHorizontal: 25,
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                <TouchableOpacity
                  style={{position: 'absolute', right: 18, top: 18}}
                  onPress={() => this.setState({editModal: false})}>
                  <Image
                    source={require('../../assets/image/ixs.png')}
                    style={{width: 22.5, height: 22.5}}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    position: 'relative',
                    width: '100%',
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
                    Страна производства
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
                    onPress={() =>
                      this.setState({
                        made_in_select: !this.state.made_in_select,
                      })
                    }>
                    <Text
                      style={{
                        padding: 5,
                        width: '100%',
                        borderRadius: 5,
                        color: '#5B5B5B',
                      }}>
                      {this.state.made_in == ''
                        ? 'Выберите страну'
                        : this.state.made_in}
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
                <TouchableOpacity
                  style={{marginTop: 50}}
                  onPress={async () => {
                    await this.sendMadeIn();
                  }}>
                  <BlueButton name="Сохранить" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal>

          <Modal visible={this.state.editUserDataModal}>
            <ImageBackground
              style={[
                {
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 22,
                },
                this.state.keyboardOpen
                  ? {justifyContent: 'flex-start'}
                  : {justifyContent: 'center'},
              ]}
              source={require('../../assets/image/blurBg.png')}>
              <View
                style={{
                  width: '90%',
                  height: 600,
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  position: 'relative',
                  paddingHorizontal: 15,
                  // paddingBottom: 40,
                }}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 18,
                    top: 18,
                    zIndex: 1,
                  }}
                  onPress={() => this.setState({editUserDataModal: false})}>
                  <Image
                    source={require('../../assets/image/ixs.png')}
                    style={{
                      width: 22.5,
                      height: 22.5,
                    }}
                  />
                </TouchableOpacity>
                <KeyboardAwareScrollView
                  style={{}}
                  showsVerticalScrollIndicator={false}>
                  <Text
                    style={{
                      marginTop: 70,
                      fontSize: 26,
                      textAlign: 'center',
                      color: '#2D9EFB',
                      fontFamily: 'Poppins_500Medium',
                      marginBottom: 20,
                    }}>
                    Изменение данных{'\n'}компании
                  </Text>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                      style={{
                        width: 75,
                        height: 75,
                        borderRadius: 8,
                        position: 'relative',
                        overflow: 'hidden',
                        alignSelf: 'center',
                        borderWidth: 1,
                        borderColor: '#888888',
                      }}>
                      <Image
                        source={{uri: this.state.urlImage + this.state.logo}}
                        style={{width: '100%', height: '100%'}}
                      />
                      <TouchableOpacity
                        style={{position: 'absolute', right: 0, top: 0}}
                        onPress={() => {
                          this.pickImage();
                        }}>
                        <Image
                          source={require('../../assets/image/edit.png')}
                          style={{width: 22, height: 22}}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginTop: 7,
                        fontFamily: 'Poppins_500Medium',
                        fontSize: 15,
                        color: '#5B5B5B',
                      }}>
                      Изменить логотип
                    </Text>

                    <View>
                      <Text
                        style={{
                          fontFamily: 'Poppins_500Medium',
                          lineHeight: 23,
                          fontSize: 15,
                          marginTop: 27,
                          marginBottom: 5,
                          color: '#5B5B5B',
                        }}>
                        Изменить название компании
                      </Text>
                      <View style={{position: 'relative'}}>
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholder={this.state.companyName}
                          style={{
                            borderWidth: 1,
                            borderColor: '#F5F5F5',
                            padding: 10,
                            width: '100%',
                            borderRadius: 5,
                          }}
                          value={this.state.companyName}
                          onChangeText={text =>
                            this.setState({companyName: text})
                          }
                        />
                        <TouchableOpacity
                          style={{position: 'absolute', right: 5, top: 15}}
                          onPress={() => this.editNameCompany()}>
                          <Text
                            style={{
                              fontFamily: 'Raleway_600SemiBold',
                              fontSize: 13,
                              color: '#2D9EFB',
                            }}>
                            Сохранить
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View>
                      <Text
                        style={{
                          fontFamily: 'Poppins_500Medium',
                          lineHeight: 23,
                          fontSize: 15,
                          marginTop: 27,
                          marginBottom: 5,
                          color: '#5B5B5B',
                        }}>
                        Изменить ссылку на веб сайт
                      </Text>

                      <View style={{position: 'relative'}}>
                        <TextInput
                          underlineColorAndroid="transparent"
                          placeholder={'https://www.google.com'}
                          style={{
                            borderWidth: 1,
                            borderColor: '#F5F5F5',
                            padding: 10,
                            width: '100%',
                            borderRadius: 5,
                          }}
                          value={this.state.site}
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
                              this.setState({site: text});
                            } else {
                              let new_text = text.replace('https://', '');

                              this.setState({site: `https://${new_text}`});
                            }
                          }}
                        />
                        <TouchableOpacity
                          style={{position: 'absolute', right: 5, top: 15}}
                          onPress={() => this.editSite()}>
                          <Text
                            style={{
                              fontFamily: 'Raleway_600SemiBold',
                              fontSize: 13,
                              color: '#2D9EFB',
                            }}>
                            Сохранить
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{marginBottom: 30}}>
                      <Text
                        style={{
                          fontFamily: 'Poppins_500Medium',
                          lineHeight: 23,
                          fontSize: 15,
                          marginTop: 27,
                          marginBottom: 5,
                          color: '#5B5B5B',
                        }}>
                        Изменить ссылку телеграм
                      </Text>
                      <View style={{position: 'relative'}}>
                        <TextInput
                          underlineColorAndroid="transparent"
                          style={{
                            borderWidth: 1,
                            borderColor: '#F5F5F5',
                            padding: 10,
                            width: '100%',
                            borderRadius: 5,
                          }}
                          onChangeText={text => {
                            if (
                              text == 't.me/' ||
                              text == 't.me' ||
                              text == 't.m' ||
                              text == 't.' ||
                              text == 't'
                            ) {
                              text = 't.me/';
                              this.setState({teleg: text});
                            } else {
                              let new_text = text.replace('t.me/', '');

                              this.setState({teleg: `t.me/${new_text}`});
                            }
                          }}
                          value={this.state.teleg}
                        />

                        <TouchableOpacity
                          style={{position: 'absolute', right: 5, top: 15}}
                          onPress={() => this.editTeleg()}>
                          <Text
                            style={{
                              fontFamily: 'Raleway_600SemiBold',
                              fontSize: 13,
                              color: '#2D9EFB',
                            }}>
                            Сохранить
                          </Text>
                        </TouchableOpacity>
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
                            openDesignerPopup: !this.state.openDesignerPopup,
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
                        <View
                          style={{
                            position: 'absolute',
                            right: 17,
                            bottom: 18,
                          }}>
                          {!this.state.openDesignerPopup && (
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
                          {this.state.openDesignerPopup && (
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
                          this.state.openDesignerPopup
                            ? styles.daNetActive
                            : styles.daNet
                        }>
                        <ScrollView nestedScrollEnabled={true}>
                          {this.state.arrItems.map((item, index) => {
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
                                onPress={() => {
                                  this.setState({
                                    collaborate: item.name,
                                    openDesignerPopup: false,
                                  });
                                  this.update_job_with_designer(item.name);
                                }}>
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
                        height: 190,
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
                            dmodelPopup: !this.state.dmodelPopup,
                          })
                        }>
                        <Text
                          style={{
                            padding: 5,
                            width: '100%',
                            borderRadius: 5,
                            fontFamily: 'Poppins_500Medium',
                          }}>
                          {this.state.dmodel}
                        </Text>
                        <View
                          style={{
                            position: 'absolute',
                            right: 17,
                            bottom: 18,
                          }}>
                          {!this.state.dmodelPopup && (
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
                          {this.state.dmodelPopup && (
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
                          this.state.dmodelPopup
                            ? styles.daNetActive
                            : styles.daNet
                        }>
                        <ScrollView nestedScrollEnabled={true}>
                          {this.state.arrItems.map((item, index) => {
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
                                onPress={() => {
                                  console.log('onpress');
                                  this.setState({
                                    dmodel: item.name,
                                    dmodelPopup: false,
                                  });
                                  this.update_dmodel(item.name);
                                }}>
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
                  </ScrollView>
                </KeyboardAwareScrollView>
              </View>
            </ImageBackground>
          </Modal>

          {/* <Modal visible={this.state.aboutUsModal}>
            <ImageBackground
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              source={require("../../assets/image/blurBg.png")}
            >
              <View
                style={{
                  width: "90%",
                  height: "40%",
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  position: "relative",
                  paddingHorizontal: 15,
                }}
              >
                <Text
                  style={{
                    marginVertical: 20,
                    fontSize: 26,
                    textAlign: "center",
                    color: "#2D9EFB",
                    fontFamily: "Poppins_500Medium",
                  }}
                >
                  Дополнительная информация
                </Text>

                <RichTextEditorComponent />

                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    position: "absolute",
                    bottom: "10%",
                  }}
                  onPress={() => {
                    this.setState({ aboutUsModal: false })
                  }}
                >
                  <BlueButton name="Ок" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal> */}

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CustomerMainPage')}
            style={{
              position: 'absolute',
              top: 10,
              left: 15,
              zIndex: 1,
            }}>
            <ArrowGrayComponent />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Poppins_600SemiBold',
                textAlign: 'center',
                marginTop: 18.29,
              }}>
              Мой профиль
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.authUserState.map((item, index) => {
              return (
                <View key={index} style={{flexDirection: 'row'}}>
                  <Image
                    source={{uri: this.state.urlImage + item.logo}}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 10,
                      marginTop: 25,
                      marginRight: 15,
                    }}
                  />
                  <View
                    style={{
                      width: '75%',
                      marginTop: 25,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: 'Poppins_500Medium',
                        }}>
                        {item.company_name}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 6,
                        }}>
                        {item.telegram !== null && (
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL('https://t.me/' + item.telegram);
                            }}>
                            <Image
                              source={require('../../assets/image/telegram.png')}
                              style={{
                                width: 24,
                                height: 24,
                                marginRight: 8,
                              }}
                            />
                          </TouchableOpacity>
                        )}
                        {item.telegram == null && (
                          <View style={{height: 24}}></View>
                        )}
                        {item.saite !== 'null' && item.saite !== null && (
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL('https://' + item.saite);
                            }}>
                            <Image
                              source={require('../../assets/image/admin-site.png')}
                              style={{
                                width: 24,
                                height: 24,
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          editUserDataModal: true,
                        });
                      }}>
                      <Image
                        source={require('../../assets/image/ep_edit.png')}
                        style={{
                          width: 22,
                          height: 22,
                          marginTop: 2,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                  }}>
                  Страна производства
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.getCountry();
                  }}>
                  <Image
                    source={require('../../assets/image/ep_edit.png')}
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 5,
                      marginBottom: 5,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder={this.state.strana}
                editable={false}
                style={{
                  borderWidth: 1,
                  borderColor: '#F5F5F5',
                  padding: 10,
                  width: '100%',
                  borderRadius: 5,
                }}
              />
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                  }}>
                  Номер телефона
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('EditPhoneNumber')
                  }>
                  <Image
                    source={require('../../assets/image/ep_edit.png')}
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 5,
                      marginBottom: 5,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder={this.state.phone}
                editable={false}
                style={{
                  borderWidth: 1,
                  borderColor: '#F5F5F5',
                  padding: 10,
                  width: '100%',
                  borderRadius: 5,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 16,
                    color: '#5B5B5B',
                    marginBottom: 5,
                  }}>
                  Пароль
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('EditPasswordCustomer')
                  }>
                  <Image
                    source={require('../../assets/image/ep_edit.png')}
                    style={{
                      width: 15,
                      height: 15,
                      marginLeft: 5,
                      marginBottom: 5,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="**********"
                secureTextEntry={true}
                editable={false}
                style={{
                  borderWidth: 1,
                  borderColor: '#F5F5F5',
                  padding: 10,
                  width: '100%',
                  borderRadius: 5,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 34,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins_500Medium',
                  color: '#333333',
                }}>
                Продукция
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  this.props.navigation.navigate('Praductia', {
                    params: this.state.id,
                  });
                }}
                style={{
                  width: 165,
                  height: 38,
                  backgroundColor: '#B5D8FE',
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                disabled={!this.state.id}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    // fontFamily: 'Poppins_500Medium',
                    fontWeight: '700',
                  }}>
                  Изменить
                </Text>
              </TouchableOpacity>
            </View>

            {/* dropDown  start*/}

            <View style={styles.cityFilter}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins_500Medium',
                  marginBottom: 11,
                  color: '#333333',
                }}>
                Города (продажи продукции)({this.state.gorodArray.length})
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  position: 'relative',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '83%',
                    borderRadius: 6,
                    position: 'relative',
                    height: 45,
                    marginRight: 12,
                  }}>
                  {this.state.gorodArray.length ? (
                    <Text
                      style={{
                        fontFamily: 'Poppins_500Medium',
                        color: '#888888',
                      }}>
                      {this.state.gorodArray.length == 80
                        ? 'Все города России'
                        : this.state.gorodArray[0]?.city_name + '...'}
                    </Text>
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.getCityApi();
                  }}>
                  <Image
                    source={require('../../assets/image/ep_edit.png')}
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* dropDown end */}
            <Text
              style={{
                fontFamily: 'Poppins_500Medium',
                lineHeight: 23,
                fontSize: 16,
                // color: "#5B5B5B",
                marginBottom: 5,
                marginTop: 15,
              }}>
              Дополнительная информация
            </Text>
            {!this.state.about_us ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '95%',
                    flexDirection: 'row',
                    position: 'relative',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#F5F5F5',
                      borderRadius: 6,
                      position: 'relative',
                      marginRight: 12,
                      width: '88%',
                      padding: 10,
                      height: 48,
                    }}></View>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('AboutUsScreen', {
                        value: this.state.about_us,
                      });
                    }}>
                    <Image
                      source={require('../../assets/image/ep_edit.png')}
                      style={{
                        width: 30,
                        height: 30,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  flexDirection: 'row',
                  position: 'relative',
                  marginTop: 15,
                }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    borderRadius: 6,
                    position: 'relative',
                    marginRight: 12,
                    width: '100%',
                    paddingHorizontal: 10,
                  }}>
                  <HTML
                    contentWidth={700}
                    source={{
                      html: `<div style="font-size: 16px">${
                        this.state.about_us ? this.state.about_us : ''
                      }</div>`,
                    }}
                  />
                </View>
              </View>
            )}

            {/**/}
            <TouchableOpacity
              onPress={async () => {
                await this.logouth();
              }}
              style={{
                width: 165,
                height: 38,
                backgroundColor: '#B5D8FE',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 40,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: '700',
                }}>
                Выйти
              </Text>
            </TouchableOpacity>

            <Modal
              visible={this.state.delate_accaunt}
              transparent
              animationType="slide">
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '80%',
                    borderRadius: 20,
                    backgroundColor: 'white',
                    shadowOffset: {height: 10, width: 10},
                    elevation: 10,
                    shadowColor: 'black',
                    shadowOpacity: 0.5,
                    position: 'relative',
                    padding: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Poppins_500Medium',
                      textAlign: 'center',
                      marginVertical: 20,
                    }}>
                    Вы уверены, что хотите удалить свой акаунт?{'\n'} Все данные
                    будут утеряны.
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}>
                    <TouchableOpacity
                      style={{
                        paddingVertical: 10,
                        width: '40%',
                        alignItems: 'center',
                        backgroundColor: '#52A8EF',
                        borderRadius: 10,
                      }}
                      onPress={async () => {
                        await this.delateAccaunt();
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'Poppins_400Regular',
                        }}>
                        Да, уверен.
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        paddingVertical: 10,
                        width: '40%',
                        alignItems: 'center',
                        backgroundColor: '#52A8EF',
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        this.setState({delate_accaunt: false});
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'Poppins_400Regular',
                        }}>
                        Отмена.
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              onPress={() => {
                this.setState({delate_accaunt: true});
              }}
              style={{
                width: 165,
                height: 38,
                backgroundColor: '#B5D8FE',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginVertical: 20,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: '700',
                }}>
                Удалить
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {this.state.keyboardOpen === false && (
          <CustomerMainPageNavComponent
            active_page={'Профиль'}
            navigation={this.props.navigation}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 15,
  },
  container: {
    position: 'relative',
    paddingBottom: 3,
  },
  cityFilter: {
    marginTop: 25,
    width: '100%',
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
  gorodFilter: {
    marginTop: 25,
    width: '100%',
  },
  setGorodFilter: {
    width: '100%',
    height: 0,
  },
  setGorodFilterActive: {
    width: '100%',
    height: 120,
    elevation: 2,
    borderColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
  },
  DesignerRemunerationPercentageParent: {
    width: '96%',
    marginTop: 5,
    alignSelf: 'center',
  },
  DesignerRemunerationPercentageParentRead: {
    width: '100%',
    marginTop: 0,
    alignSelf: 'center',
  },
  DesignerRemunerationPercentage: {
    width: '93%',
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
    width: '25.5%',
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
    marginRight: 10,
  },
  procent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    borderRadius: 6,
    width: 45,
    height: '100%',
    paddingLeft: 5,
  },
  presoble: {
    width: 90,
    height: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
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
