import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import Svg, {Path, Rect} from 'react-native-svg';
import WebView from 'react-native-webview';
import BlueButton from '../../components/Component/Buttons/BlueButton';
import Slider2 from '../slider/Slider2';
import DesignerPageNavComponent from './DesignerPageNav';

const width = Dimensions.get('window').width;
const {width: screenWidth} = Dimensions.get('window');
export default class DesignerPageTwoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      RewardModal: false,
      loading: false,
      bronyModal: false,
      update: true,
      changed: '',
      sOpenCityDropDown: false,
      parent_name: '',
      user: [],
      user_bonus_for_designer: [],
      user_category_for_product: [],
      city_for_sales_user: [],
      products: [],
      active: 0,

      categorySelect: false,

      praizvaditelSelect: false,

      getPraizvaditel: [],
      company_name_url: '',
      getPraizvaditelMap: [
        {
          proizvodtel_name: '',
          proizvodtel_id: '',
          proizvoditel_price: '',
          drobdown_is_open: false,
        },
      ],

      praizvaditel_name: '',

      urlImage: `https://admin.refectio.ru/storage/app/uploads/`,
      valid_error: false,

      categoryItems: [],
      loading: false,
      phone: '',
      phone_error: false,
      name: '',
      name_error: false,
      dubl_phone: '',
      dubl_name: '',
      city: '',
      city_error: false,
      category_id: '',
      category_name: '',
      category_name_error: false,
      proizvaditel_info: [],
      proizvaditel_info_error: false,

      favoriteBool: false,

      VipiskaModal: false,
      extract: '',
      whatsapp: '',

      change_category_loaded: false,

      pressCategory: true,
      dmodel_popup: false,
      designerModal: false,
      city_count: null,

      about_us: '',
      aboutUsPopup: false,

      aboutProductPopup: false,
      aboutProduct: '',
      meshok: '',
    };
  }

  setNewPraizvaditelPrice = async (value, index) => {
    let {getPraizvaditelMap} = this.state;
    getPraizvaditelMap[index].proizvoditel_price = value;

    await this.setState({
      getPraizvaditelMap: getPraizvaditelMap,
    });
  };

  delatePraizvaditelPrice = async index => {
    let {getPraizvaditelMap} = this.state;
    getPraizvaditelMap.splice(index, 1);

    await this.setState({
      getPraizvaditelMap: getPraizvaditelMap,
    });
  };

  addPraizvaditelPrice = async index => {
    let {getPraizvaditelMap} = this.state;
    getPraizvaditelMap.push({
      drobdown_is_open: false,
      proizvoditel_price: '',
      proizvodtel_id: '',
      proizvodtel_name: '',
    });

    await this.setState({
      getPraizvaditelMap: getPraizvaditelMap,
    });
  };

  setNewPraizvaditelNameAndId = async (item, index) => {
    let {getPraizvaditelMap} = this.state;

    getPraizvaditelMap[index].proizvodtel_name = item.company_name;
    getPraizvaditelMap[index].proizvodtel_id = item.id;
    getPraizvaditelMap[index].drobdown_is_open =
      !getPraizvaditelMap[index].drobdown_is_open;

    await this.setState({
      praizvaditel_name: item.company_name,
      getPraizvaditelMap: getPraizvaditelMap,
    });
  };

  toggleProizvoditelDropdown = async index => {
    let {getPraizvaditelMap} = this.state;

    getPraizvaditelMap[index].drobdown_is_open =
      !getPraizvaditelMap[index].drobdown_is_open;

    await this.setState({
      getPraizvaditelMap: getPraizvaditelMap,
    });
  };

  // stexic sharunakel
  getObjectData = async id => {
    this.setState({loading: true});
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;

    let userID = id;

    await fetch(
      `https://admin.refectio.ru/public/api/getOneProizvoditel/user_id=` +
        userID,
      {
        method: 'GET',
        headers: {
          Authorization: AuthStr,
        },
      },
    )
      .then(response => response.json())
      .then(res => {
        let arr = res.data.user_category_for_product;
        const isFound = res.data.user_category_for_product.findIndex(
          element => +element.parent_category_id == 10,
        );
        if (isFound == 0) {
          arr = res.data.user_category_for_product;
          let lastItem = res.data.user_category_for_product[0];
          arr.shift(res.data.user_category_for_product[0]);
          arr.push(lastItem);
        }
        if (res.data.Favorit_button === true) {
          this.setState({favoriteBool: true});
        } else {
          this.setState({favoriteBool: false});
        }
        const isFoundKitchen = arr.findIndex(
          element => +element.parent_category_id == 2,
        );

        if (isFoundKitchen >= 0) {
          let firstItem = arr.splice(isFoundKitchen, 1);
          arr.unshift(firstItem[0]);
        }

        const receptionАrea = arr.findIndex(
          element => +element.parent_category_id == 12,
        );
        if (receptionАrea >= 0) {
          let myItem = arr.splice(receptionАrea, 1);
          arr.push(myItem[0]);
        }

        this.setState({loading: false});

        this.setState({
          company_name_url: res.data.user[0].company_name_url,
          user: res.data.user,
          user_category_for_product: arr,
          city_for_sales_user: res.data.city_for_sales_user,
          whatsapp: res.data.user[0].watsap_phone,
          city_count: res.data.city_count,
          about_us: res.data.user[0].about_us,
          meshok: res.data.user[0].meshok,
        });
      });
  };

  getCategory = async () => {
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

  favorite = async () => {
    const {id, navigation} = this.props;
    let userID = this.props.route.params.id ? this.props.route.params.id : id;
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);

    let formdata = new FormData();
    formdata.append('user_id', userID);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    if (this.state.favoriteBool == true) {
      fetch(`https://admin.refectio.ru/public/api/addtoFavorit`, requestOptions)
        .then(response => response.json())
        .then(result => {
          this.setState({favoriteBool: false});
          this.getObjectData(userID);
        })
        .catch(error => console.log('error', error));
    } else if (this.state.favoriteBool == false) {
      fetch(
        `https://admin.refectio.ru/public/api/deleteFavoritProizvoditel`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          this.setState({favoriteBool: true});
          this.getObjectData(userID);
        })
        .catch(error => console.log('error', error));
    }
  };

  // updatei apin poxel

  updateProduct = async (parent_category_name, id) => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    myHeaders.append('Authorization', 'Bearer ' + userToken);

    let formdata = new FormData();
    formdata.append('parent_category_name', parent_category_name);
    formdata.append('user_id', id);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/filtergetOneProizvoditel`,
      requestOptions,
    )
      .then(response => response.json())
      .then(res => {
        if (res.status === false) {
          this.setState({
            products: [],
          });

          return false;
        }

        let data = res.data;

        for (let i = 0; i < data.length; i++) {
          if (data[i].product_image.length < 1) {
            data[i].images = [];
            continue;
          }

          let product_image = data[i].product_image;

          data[i].images = product_image;
        }

        this.setState({
          user: data.user,
          user_bonus_for_designer: res.data.user_bonus_for_designer,
          city_for_sales_user: res.data.city_for_sales_user,
          products: data.products,
          show_plus_button: false,
          extract: data.user[0].extract,
          whatsapp: res.data.user[0].watsap_phone,
          change_category_loaded: false,
        });
        this.setState({loading: false});
      })
      .catch(error => console.log('error', error));
  };

  handleClearData = () => {
    this.setState({
      user: [],
      user_category_for_product: [],
      city_for_sales_user: [],
      whatsapp: '',
      city_count: null,
      about_us: '',
    });
  };

  handleShare = async () => {
    const shareingStartWith = 'refectio.ru/';
    try {
      {
        this.state.user[0]?.company_name.split(' ').length == 1;
        url = `${shareingStartWith}${this.state.company_name_url}/${this.state.user[0].id}`;
      }

      if (Platform.OS === 'android') {
        await Share.share({message: url});
        // Handle the result if needed
      } else {
        await Share.share({message: url});
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  updateProductAfterClickToCategory = async (parent_category_name, index) => {
    const {id} = this.props;
    await this.setState({
      change_category_loaded: true,
    });

    if (this.state.pressCategory) {
      this.setState({
        pressCategory: false,
        active: index,
      });

      await this.setState({
        change_category_loaded: true,
      });

      let userID = this.props.route.params?.id
        ? this.props.route.params?.id
        : id;

      let myHeaders = new Headers();
      let userToken = await AsyncStorage.getItem('userToken');
      myHeaders.append('Authorization', 'Bearer ' + userToken);

      let formdata = new FormData();
      formdata.append('parent_category_name', parent_category_name);
      formdata.append('user_id', userID);

      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch(
        `https://admin.refectio.ru/public/api/filtergetOneProizvoditel`,
        requestOptions,
      )
        .then(response => response.json())
        .then(res => {
          if (res.status === false) {
            this.setState({
              products: [],
              // show_plus_button: false
              change_category_loaded: false,
            });

            return false;
          }

          let data = res.data;
          let new_data_result = [];

          for (let i = 0; i < data.length; i++) {
            if (data[i].product_image.length < 1) {
              data[i].images = [];
              continue;
            }

            let product_image = data[i].product_image;

            data[i].images = product_image;
          }

          this.setState({
            // user: data.user,
            // user_bonus_for_designer: res.data.user_bonus_for_designer,
            // user_category_for_product: res.data.user_category_for_product,
            // city_for_sales_user: res.data.city_for_sales_user,
            products: data.products,
            // show_plus_button: false,
            // extract: data.user[0].extract,
            // whatsapp: res.data.user[0].watsap_phone,
            change_category_loaded: false,
            pressCategory: true,
          });
        });
    }
  };
  addProtocol(url) {
    const protocolRegex = /^https?:\/\//i;
    if (protocolRegex.test(url)) {
      return url;
    }
    return 'http://' + url;
  }

  loadedDataAfterLoadPage = async id => {
    await this.getObjectData(id);
    this.setState({
      changed:
        this.state.city_for_sales_user.length >= 78
          ? 'Все города России'
          : this.state.city_for_sales_user[0].city_name,
    });
  };

  handleBackButtonClick() {
    const {id, setId, setUrlLinking} = this.props;
    this.setState({update: true});
    if (this.props.route.params?.prevRoute == 'DesignerSaved') {
      this.props.navigation.navigate('DesignerSaved');
    } else {
      if (this.props.route.params?.fromSearch === true) {
        this.props.navigation.navigate(this.props.route.params.prevRoute);
        this.props.id = null;
      } else if (
        this.props.route.params?.id ||
        (this.props.id && this.props.route.params?.fromSearch == false)
      ) {
        this.props.navigation.navigate('DesignerPage', {screen: true});
      } else if (
        this.props.route.params?.id ||
        (this.props.id && !this.props.route.params?.fromSearch)
      ) {
        this.props.navigation.navigate('DesignerPage', {screen: true});
      } else {
        this.props.navigation.goBack();
      }
    }

    setId(null);
    setUrlLinking(null);
    this.handleClearData();
  }

  componentDidMount() {
    const {id, navigation, urlMy} = this.props;
    console.log(urlMy, 'no');
    loadedDataAfterLoadPageOne = async () => {
      await this.getObjectData(
        this.props.route.params?.id ? this.props.route.params?.id : id,
      );

      await this.updateProduct(
        this.state.parent_name.length > 0
          ? this.state.parent_name
          : this.state.user_category_for_product[0].parent_category_name,
        this.props.route.params?.id ? this.props.route.params?.id : id,
      );
    };
    loadedDataAfterLoadPageOne();

    this.loadedDataAfterLoadPage(
      this.props.route.params?.id ? this.props.route.params?.id : id,
    );
    this.focusListener = navigation.addListener('focus', () => {
      console.log(urlMy, 'no');
      this.loadedDataAfterLoadPage(
        this.props.route.params?.id ? this.props.route.params?.id : id,
      );
      console.log(
        this.props.route.params?.prevRoute == 'DesignerPage',
        urlMy == 'yes',
        'utlll',
      );
      if (
        this.props.route.params?.prevRoute == 'DesignerPage' &&
        this.state.update
      ) {
        // console.log('yeeeeeebaaaat');
        loadedDataAfterLoadPageOne();
        this.setState({change_category_loaded: true});
      }
    });
  }

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener();
      this.handleClearData();
    }
  }

  render() {
    console.log(this.state.user[0]?.company_name.length);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.main}>
          <Modal visible={this.state.VipiskaModal}>
            <ImageBackground
              source={require('../../assets/image/blurBg.png')}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  height: 389,
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  position: 'relative',
                }}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    width: 22.5,
                    height: 22.5,
                    right: 21.75,
                    top: 21.75,
                  }}
                  onPress={() => this.setState({VipiskaModal: false})}>
                  <Image
                    source={require('../../assets/image/ixs.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#2D9EFB',
                    fontSize: 26,
                    marginTop: 83,
                    textAlign: 'center',
                    fontFamily: 'Poppins_600SemiBold',
                  }}>
                  Вы хотите скачать{'\n'}выписку
                </Text>
                <View style={[styles.Vipiska, {marginTop: 80}]}>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(this.state.urlImage + this.state.extract);
                      this.setState({VipiskaModal: false});
                    }}>
                    <BlueButton name="Подтвердить" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 285,
                      height: 44,
                      borderWidth: 3,
                      borderColor: '#B5D8FE',
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 12,
                    }}
                    onPress={() => this.setState({VipiskaModal: false})}>
                    <Text
                      style={{
                        color: '#B5D8FE',
                        fontSize: 18,
                        fontFamily: 'Poppins_700Bold',
                      }}>
                      Отменить
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </Modal>

          <Modal visible={this.state.RewardModal}>
            <ImageBackground
              source={require('../../assets/image/blurBg.png')}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  position: 'relative',
                }}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    width: 22.5,
                    height: 22.5,
                    right: 21.75,
                    top: 21.75,
                  }}
                  onPress={() => this.setState({RewardModal: false})}>
                  <Image
                    source={require('../../assets/image/ixs.png')}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#2D9EFB',
                    fontSize: 26,
                    marginTop: 70,
                    textAlign: 'center',
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  Вознаграждение
                </Text>

                <View style={styles.DesignerRemunerationPercentageParent}>
                  {this.state.user_bonus_for_designer.map((item, index) => {
                    return (
                      <View
                        style={styles.DesignerRemunerationPercentage}
                        key={index}>
                        <Text style={styles.procentText}>От</Text>

                        <MaskInput
                          editable={false}
                          keyboardType={'number-pad'}
                          style={styles.procentInput}
                          value={item.start_price}
                          placeholder={''}
                          mask={
                            item.start_price.length == 7
                              ? [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/]
                              : [
                                  /\d/,
                                  '.',
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                  '.',
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                ]
                          }
                        />

                        <View style={styles.rubli}>
                          <Svg
                            width="11"
                            height="15"
                            viewBox="0 0 11 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <Path
                              d="M6.285 8.99997C7.37392 9.02686 8.42909 8.62091 9.21919 7.8711C10.0093 7.1213 10.4699 6.08881 10.5 4.99997C10.4699 3.91113 10.0093 2.87865 9.21919 2.12884C8.42909 1.37904 7.37392 0.973087 6.285 0.999974H2C1.86739 0.999974 1.74021 1.05265 1.64645 1.14642C1.55268 1.24019 1.5 1.36737 1.5 1.49997V7.99997H0.5C0.367392 7.99997 0.240215 8.05265 0.146447 8.14642C0.0526785 8.24019 0 8.36736 0 8.49997C0 8.63258 0.0526785 8.75976 0.146447 8.85353C0.240215 8.9473 0.367392 8.99997 0.5 8.99997H1.5V9.99997H0.5C0.367392 9.99997 0.240215 10.0527 0.146447 10.1464C0.0526785 10.2402 0 10.3674 0 10.5C0 10.6326 0.0526785 10.7598 0.146447 10.8535C0.240215 10.9473 0.367392 11 0.5 11H1.5V14.5C1.5 14.6326 1.55268 14.7598 1.64645 14.8535C1.74021 14.9473 1.86739 15 2 15C2.13261 15 2.25979 14.9473 2.35355 14.8535C2.44732 14.7598 2.5 14.6326 2.5 14.5V11H7C7.13261 11 7.25979 10.9473 7.35355 10.8535C7.44732 10.7598 7.5 10.6326 7.5 10.5C7.5 10.3674 7.44732 10.2402 7.35355 10.1464C7.25979 10.0527 7.13261 9.99997 7 9.99997H2.5V8.99997H6.285ZM2.5 1.99997H6.285C7.10839 1.9743 7.90853 2.27531 8.51083 2.83733C9.11313 3.39935 9.46872 4.17677 9.5 4.99997C9.47001 5.82362 9.11483 6.60182 8.51223 7.16412C7.90964 7.72642 7.10875 8.02698 6.285 7.99997H2.5V1.99997Z"
                              fill="#888888"
                            />
                          </Svg>
                        </View>

                        <Text style={styles.procentText}>До</Text>

                        <MaskInput
                          maxLength={10}
                          keyboardType="number-pad"
                          style={styles.procentInput}
                          value={item.before_price}
                          placeholder={
                            this.state.user_bonus_for_designer.length <= 1
                              ? '9.999.999'
                              : ''
                          }
                          editable={false}
                          mask={
                            item.before_price.length == 7
                              ? [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/]
                              : [
                                  /\d/,
                                  '.',
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                  '.',
                                  /\d/,
                                  /\d/,
                                  /\d/,
                                ]
                          }
                        />

                        <View style={styles.rubli}>
                          <Svg
                            width="11"
                            height="15"
                            viewBox="0 0 11 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <Path
                              d="M6.285 8.99997C7.37392 9.02686 8.42909 8.62091 9.21919 7.8711C10.0093 7.1213 10.4699 6.08881 10.5 4.99997C10.4699 3.91113 10.0093 2.87865 9.21919 2.12884C8.42909 1.37904 7.37392 0.973087 6.285 0.999974H2C1.86739 0.999974 1.74021 1.05265 1.64645 1.14642C1.55268 1.24019 1.5 1.36737 1.5 1.49997V7.99997H0.5C0.367392 7.99997 0.240215 8.05265 0.146447 8.14642C0.0526785 8.24019 0 8.36736 0 8.49997C0 8.63258 0.0526785 8.75976 0.146447 8.85353C0.240215 8.9473 0.367392 8.99997 0.5 8.99997H1.5V9.99997H0.5C0.367392 9.99997 0.240215 10.0527 0.146447 10.1464C0.0526785 10.2402 0 10.3674 0 10.5C0 10.6326 0.0526785 10.7598 0.146447 10.8535C0.240215 10.9473 0.367392 11 0.5 11H1.5V14.5C1.5 14.6326 1.55268 14.7598 1.64645 14.8535C1.74021 14.9473 1.86739 15 2 15C2.13261 15 2.25979 14.9473 2.35355 14.8535C2.44732 14.7598 2.5 14.6326 2.5 14.5V11H7C7.13261 11 7.25979 10.9473 7.35355 10.8535C7.44732 10.7598 7.5 10.6326 7.5 10.5C7.5 10.3674 7.44732 10.2402 7.35355 10.1464C7.25979 10.0527 7.13261 9.99997 7 9.99997H2.5V8.99997H6.285ZM2.5 1.99997H6.285C7.10839 1.9743 7.90853 2.27531 8.51083 2.83733C9.11313 3.39935 9.46872 4.17677 9.5 4.99997C9.47001 5.82362 9.11483 6.60182 8.51223 7.16412C7.90964 7.72642 7.10875 8.02698 6.285 7.99997H2.5V1.99997Z"
                              fill="#888888"
                            />
                          </Svg>
                        </View>

                        <View style={styles.procent}>
                          <TextInput
                            style={{color: '#888888'}}
                            keyboardType="number-pad"
                            editable={false}
                            value={item.percent}
                          />
                          <Text style={{color: '#888888'}}>%</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ImageBackground>
          </Modal>

          <Modal visible={this.state.dmodel_popup}>
            <ImageBackground
              source={require('../../assets/image/blurBg.png')}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  height: '30%',
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  position: 'relative',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 18,
                    top: 18,
                  }}
                  onPress={() => this.setState({dmodel_popup: false})}>
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
                    marginTop: 60,
                    fontSize: 22,
                    textAlign: 'center',
                    color: '#2D9EFB',
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  Предоставляет 3d модели по запросу
                </Text>
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                  }}
                  onPress={() => this.setState({dmodel_popup: false})}>
                  <BlueButton name="Ок" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal>

          <Modal visible={this.state.designerModal}>
            <ImageBackground
              source={require('../../assets/image/blurBg.png')}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  height: '28%',
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  position: 'relative',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 18,
                    top: 18,
                  }}
                  onPress={() => this.setState({designerModal: false})}>
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
                    marginTop: 60,
                    fontSize: 22,
                    textAlign: 'center',
                    color: '#2D9EFB',
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  Сотрудничает с дизайнерами
                </Text>
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                  }}
                  onPress={() => this.setState({designerModal: false})}>
                  <BlueButton name="Ок" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal>

          <Modal visible={this.state.aboutUsPopup}>
            <ImageBackground
              source={require('../../assets/image/blurBg.png')}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  height: this.state.about_us ? '70%' : '30%',
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  position: 'relative',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 20,
                    textAlign: 'center',
                    color: '#2D9EFB',
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  Дополнительная информация
                </Text>

                {!this.state.about_us ? (
                  <Text style={{marginVertical: 20}}>
                    Производитель не добавил доп. информацию
                  </Text>
                ) : (
                  <WebView
                    style={{
                      height: 100,
                      width: 280,
                      marginTop: 30,
                      zIndex: 99999,
                    }}
                    source={{
                      html: `<div style="font-size:55px">${this.state.about_us}</div>`,
                    }}
                  />
                )}

                <TouchableOpacity
                  style={{
                    marginVertical: 20,
                  }}
                  onPress={() => this.setState({aboutUsPopup: false})}>
                  <BlueButton name="Ок" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal>

          <Modal visible={this.state.aboutProductPopup}>
            <ImageBackground
              source={require('../../assets/image/blurBg.png')}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  height: this.state.about_us ? '30%' : '22%',
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  position: 'relative',
                  paddingHorizontal: 15,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    marginTop: 15,
                    fontSize: 20,
                    textAlign: 'center',
                    color: '#2D9EFB',
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  Дополнительная информация
                </Text>

                <WebView
                  style={{
                    height: 100,
                    width: 280,
                    marginTop: 30,
                    zIndex: 99999,
                  }}
                  source={{
                    html: `<div style="font-size:55px;">${this.state.aboutProduct}</div>`,
                  }}
                />

                <TouchableOpacity
                  style={{
                    marginVertical: 20,
                  }}
                  onPress={() => this.setState({aboutProductPopup: false})}>
                  <BlueButton name="Ок" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
              marginLeft: -10,
              paddingBottom: 10,
            }}
            onPress={this.handleBackButtonClick}>
            <Svg
              width={25}
              height={30}
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <Path
                d="M20.168 27.708a1.458 1.458 0 01-1.137-.54l-7.044-8.75a1.458 1.458 0 010-1.851l7.292-8.75a1.46 1.46 0 112.245 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.138 2.391z"
                fill="#94D8F4"
              />
            </Svg>
            <Text style={styles.backText}>Назад</Text>
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginTop: 15}}>
            <View style={styles.campaign}>
              {this.state.user.length > 0 && (
                <>
                  <View style={styles.infoCompanyMain}>
                    <View style={{width: '32%'}}>
                      <Image
                        source={{
                          uri: this.state.urlImage + this.state.user[0].logo,
                        }}
                        style={{
                          width: 100,
                          height: 100,
                          marginRight: 12,
                          borderColor: '#C8C8C8',
                          borderWidth: 1,
                          resizeMode: 'cover',
                          borderRadius: 10,
                        }}
                      />
                    </View>

                    <View style={styles.infoCompany}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 20,
                              color: '#333333',
                              fontWeight: '700',
                            }}>
                            {this.state.user[0].company_name.length >= 20
                              ? this.state.user[0].company_name.substring(
                                  0,
                                  this.state.user[0].company_name.length - 7,
                                ) + '...'
                              : this.state.user[0].company_name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#A8A8A8',
                              fontFamily: 'Raleway_500Medium',
                            }}>
                            {this.state.user[0].made_in}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            const {id, navigation} = this.props;
                            this.favorite();
                          }}>
                          {this.state.favoriteBool == true && (
                            <Image
                              source={require('../../assets/image/heartHast.png')}
                              style={{
                                width: 24,
                                height: 21.43,
                                marginBottom: 15,
                                marginRight: 1.5,
                              }}
                            />
                          )}
                          {this.state.favoriteBool == false && (
                            <Image
                              source={require('../../assets/image/heartSev.png')}
                              style={{
                                width: 24,
                                height: 21.43,
                                tintColor: 'red',
                                marginRight: 1.5,

                                marginBottom: 15,
                              }}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 4,
                          }}>
                          {`${this.state.user[0].saite}` !== 'null' && (
                            <TouchableOpacity
                              onPress={() => {
                                Linking.openURL(
                                  this.addProtocol(this.state.user[0].saite),
                                );
                              }}>
                              <Image
                                source={require('../../assets/image/globus.png')}
                                style={{
                                  width: 24,
                                  height: 24,
                                  marginRight: 14,
                                }}
                              />
                            </TouchableOpacity>
                          )}
                          {this.state.user[0].saite == null && (
                            <View style={{height: 24}}></View>
                          )}
                          {this.state.user[0].telegram !== null && (
                            <TouchableOpacity
                              onPress={() => {
                                Linking.openURL(
                                  'https://t.me/' + this.state.user[0].telegram,
                                );
                              }}>
                              <Image
                                source={require('../../assets/image/telegram.png')}
                                style={{
                                  width: 24,
                                  height: 24,
                                  marginRight: 14,
                                }}
                              />
                            </TouchableOpacity>
                          )}

                          {this.state.user[0].extract !== null && (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({VipiskaModal: true});
                              }}>
                              <Image
                                source={require('../../assets/image/sidebar.png')}
                                style={{
                                  width: 18,
                                  height: 24,
                                  marginRight: 14,
                                }}
                              />
                            </TouchableOpacity>
                          )}
                          {this.state.user[0].job_with_designer == 'Да' && (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({designerModal: true});
                              }}>
                              <Image
                                source={require('../../assets/image/design.png')}
                                style={{
                                  width: 24,
                                  height: 24,
                                  marginRight: 10,
                                }}
                              />
                            </TouchableOpacity>
                          )}
                          {this.state.user[0].dmodel == 'Да' && (
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({dmodel_popup: true})
                              }>
                              <Image
                                source={require('../../assets/image/cube.png')}
                                style={{
                                  width: 24,
                                  height: 24,
                                }}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                        <TouchableOpacity
                          style={{
                            marginTop: 4,
                            marginLeft: 1,
                          }}
                          onPress={this.handleShare}>
                          <Image
                            style={{width: 25, height: 25}}
                            source={require('../../assets/image/PNG/share.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      position: 'relative',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      alignSelf: 'center',
                      // paddingHorizontal: 0,
                      marginTop: 9,
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: '#F5F5F5',
                        width: '60%',
                        borderRadius: 5,
                        position: 'relative',
                        height: 24,
                        paddingLeft: 5,
                      }}
                      onPress={() =>
                        this.setState({
                          sOpenCityDropDown: !this.state.sOpenCityDropDown,
                        })
                      }>
                      <Text
                        style={{
                          fontFamily: 'Raleway_400Regular',
                          color: '#333333',
                        }}>
                        {this.state.changed}
                      </Text>
                      <View
                        style={{position: 'absolute', right: 17, bottom: 6}}>
                        {!this.state.sOpenCityDropDown && (
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
                        {this.state.sOpenCityDropDown && (
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
                        this.state.sOpenCityDropDown
                          ? styles.sOpenCityDropDownActive
                          : styles.sOpenCityDropDown
                      }>
                      <ScrollView nestedScrollEnabled={true}>
                        {this.state.city_for_sales_user.length >= 78 ? (
                          <TouchableOpacity
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              textAlign: 'left',
                            }}
                            onPress={() =>
                              this.setState({
                                sOpenCityDropDown: false,
                              })
                            }>
                            <Text
                              style={{
                                textAlign: 'left',
                                paddingVertical: 10,
                                fontFamily: 'Raleway_Regular',
                                color: '#333333',
                              }}>
                              {this.state.changed}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          this.state.city_for_sales_user.map((item, index) => {
                            return (
                              <TouchableOpacity
                                key={index}
                                style={{
                                  width: '100%',
                                  justifyContent: 'center',
                                  textAlign: 'left',
                                }}
                                onPress={() =>
                                  this.setState({
                                    changed: item.city_name,
                                    sOpenCityDropDown: false,
                                  })
                                }>
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    paddingVertical: 10,
                                    fontFamily: 'Raleway_400Regular',
                                    color: '#333333',
                                  }}>
                                  {item.city_name}
                                </Text>
                              </TouchableOpacity>
                            );
                          })
                        )}
                      </ScrollView>
                    </View>

                    {this.state.user.length > 0 && (
                      <View style={styles.checkBox}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 13,
                              marginRight: 5,
                              fontFamily: 'Raleway_400Regular',
                              color: '#333333',
                            }}>
                            Шоурум
                          </Text>
                          <View>
                            {this.state.user[0].show_room == 'Да' ? (
                              <Svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <Path
                                  d="M4 11.4L7.52941 15.4L16 5"
                                  stroke="#52A8EF"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <Rect
                                  x="0.2"
                                  y="0.2"
                                  width="19.6"
                                  height="19.6"
                                  rx="3.8"
                                  stroke="#52A8EF"
                                  stroke-width="0.4"
                                />
                              </Svg>
                            ) : (
                              <Svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <Rect
                                  x="0.2"
                                  y="0.2"
                                  width="19.6"
                                  height="19.6"
                                  rx="3.8"
                                  stroke="#52A8EF"
                                  stroke-width="0.4"
                                />
                              </Svg>
                            )}
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                </>
              )}

              <View
                style={{
                  width: '100%',
                  height: 58,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 14,
                  marginBottom: 19,
                  zIndex: -1,
                }}>
                <TouchableOpacity
                  style={[
                    styles.info,
                    {
                      borderRightWidth: 2,
                      borderRightColor: '#EEEEEE',
                    },
                  ]}
                  onPress={() => {
                    this.setState({update: false});
                    this.props.navigation.navigate('AboutUsScreen', {
                      value: this.state.about_us,
                      hideText: true,
                      meshok: this.state.meshok,
                    });
                  }}>
                  <Image
                    source={require('../../assets/image/la_percent.png')}
                    style={{
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                    }}
                  />
                  <Text style={styles.infoText}>Доп. информация</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.info,
                    {borderRightWidth: 2, borderRightColor: '#EEEEEE'},
                  ]}
                  onPress={() => {
                    const number = this.state.whatsapp;
                    const convertedNumber = number.replace(/\D/g, '');
                    Linking.openURL(
                      `http://wa.me/${convertedNumber}?text=Здравствуйте! Пишу из приложения Refectio.`,
                      // `whatsapp://send?text=Здравствуйте!Пишу из приложения Refectio&phone=${this.state.whatsapp}`
                    ).catch(err => console.log(err));
                  }}>
                  <Image
                    source={require('../../assets/image/whatsapp.png')}
                    style={{width: 30, height: 30, resizeMode: 'contain'}}
                  />
                  <Text style={styles.infoText}>Написать в вотсап</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.info}>
                  <Image
                    source={require('../../assets/image/pcichka.png')}
                    style={{width: 30, height: 30, resizeMode: 'contain'}}
                  />
                  <Text style={styles.infoText}>Отзывы</Text>
                </TouchableOpacity>
              </View>
              <View style={{zIndex: -1}}>
                <ScrollView
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}>
                  {this.state.user_category_for_product.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={async () => {
                          await this.updateProductAfterClickToCategory(
                            item.parent_category_name,
                            index,
                          );
                          this.setState({active: index});
                          this.setState({
                            parent_name: item.parent_category_name,
                          });
                        }}
                        style={
                          this.state.active === index
                            ? styles.categoryButtonActive
                            : styles.categoryButton
                        }>
                        <Text
                          style={
                            this.state.active === index
                              ? styles.categoriesNameActive
                              : styles.categoriesName
                          }>
                          {item.parent_category_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {this.state.change_category_loaded && (
                <View style={{marginTop: 200}}>
                  <ActivityIndicator size={100} color={'#C2C2C2'} />
                </View>
              )}

              {!this.state.change_category_loaded &&
                this.state.products.map((item, index) => {
                  return (
                    <View key={index} style={{marginTop: 18}}>
                      <Slider2 slid={item.product_image} />
                      <View
                        style={{
                          width: '100%',
                        }}>
                        <View style={styles.itemNameBox}>
                          <Text style={styles.itemName}>{item.name}</Text>
                        </View>
                        {item.facades && (
                          <Text
                            style={{
                              color: '#333333',
                              width: '90%',
                              marginTop: Platform.OS === 'ios' ? 2 : 0,
                            }}>
                            Фасады: {item.facades}
                          </Text>
                        )}
                        {item.frame && (
                          <Text style={{color: '#333333', width: '90%'}}>
                            Корпус: {item.frame}
                          </Text>
                        )}
                        {item.profile && (
                          <Text style={{color: '#333333', width: '90%'}}>
                            Профиль: {item.profile}
                          </Text>
                        )}
                        {item.tabletop && (
                          <Text style={{color: '#333333', width: '90%'}}>
                            Столешница: {item.tabletop}
                          </Text>
                        )}
                        {item.length && (
                          <Text style={{color: '#333333', width: '90%'}}>
                            Длина: {item.length.replace('.', ',')} м.
                          </Text>
                        )}
                        {item.height && (
                          <Text style={{color: '#333333', width: '90%'}}>
                            Высота: {item.height.replace('.', ',')} м.
                          </Text>
                        )}
                        {item.material && (
                          <Text style={{color: '#333333', width: '90%'}}>
                            Материал: {item.material}
                          </Text>
                        )}
                        {item.price && (
                          <Text style={{color: '#333333', width: '90%'}}>
                            Цена:{' '}
                            {item.price
                              .toString()
                              .split('.')
                              .join('')
                              .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                            руб.
                          </Text>
                        )}
                        {item.about &&
                          item.about != 'null' &&
                          item.about != '<p><br></p>' &&
                          item.about != 'undefined' && (
                            <TouchableOpacity
                              style={{
                                width: 27,
                                height: 27,
                                position: 'absolute',
                                right: 0,
                                top: 5,
                              }}
                              onPress={() => {
                                this.setState({update: false});
                                this.props.navigation.navigate(
                                  'AboutUsScreen',
                                  {
                                    value: item.about,
                                    hideText: true,
                                    meshok: 'no',
                                  },
                                );
                              }}>
                              <Image
                                source={require('../../assets/image/Screenshot_2.png')}
                                style={{width: 27, height: 27}}
                                width={27}
                                height={27}
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    </View>
                  );
                })}
            </View>
          </ScrollView>
        </View>
        <DesignerPageNavComponent
          active_page={''}
          navigation={this.props.navigation}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 15,
    position: 'relative',
  },
  itemNameBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 'auto',
    marginTop: 5,
    marginBottom: 4,
  },
  itemName: {
    fontFamily: 'Raleway_600SemiBold',
    fontSize: 13,
    color: '#333333',
    fontWeight: '700',
    width: '90%',
  },
  itemType: {
    fontFamily: 'Raleway_600SemiBold',
    fontSize: 13,
    color: '#333333',
    fontWeight: '700',
  },
  campaign: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 34,
  },
  infoCompanyMain: {
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  infoCompany: {
    width: '68.7%',
    // backgroundColor: 'red',
  },
  categoriesName: {
    fontSize: 14,
    // fontFamily: 'Raleway_600SemiBold',
    fontWeight: '500',
    color: '#333333',
  },
  categoriesNameActive: {
    fontSize: 14,
    // fontFamily: 'Raleway_600SemiBold',
    fontWeight: '500',
    color: '#fff',
  },
  info: {
    width: '33.3%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'Raleway_500Medium',
    color: '#969696',
  },
  sOpenCityDropDown: {
    height: 0,
    left: 0,
    position: 'absolute',
    top: '100%',
    zIndex: 100,
  },
  checkBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  sOpenCityDropDownActive: {
    width: '60%',
    height: 120,
    left: 0,
    position: 'absolute',
    top: '100%',
    elevation: 2,
    borderColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 5,
    zIndex: 100,
    backgroundColor: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingBottom: 11,
    paddingTop: 9,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginRight: 6,
  },
  categoryButtonActive: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: '#94D8F4',
    borderRadius: 8,
    marginRight: 6,
  },
  DesignerRemunerationPercentageParent: {
    width: '97%',
    marginTop: 85,
    alignSelf: 'center',
    marginBottom: 20,
  },
  procentText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#888888',
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
  zakazInfo: {
    fontSize: 14,
    fontFamily: 'Raleway_400Regular',
  },
  DesignerRemunerationPercentage: {
    width: '95%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  procentInput: {
    color: '#5B5B5B',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    borderRadius: 6,
    width: '25.5%',
    height: '100%',
    paddingLeft: 4,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#888888',
    marginRight: 8,
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
  categorySelectActive: {
    width: '100%',
    height: 120,
    left: 0,
    elevation: 2,
    borderColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 5,
    zIndex: 100,
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  categorySelect: {
    width: '50%',
    height: 0,
    left: 0,
    position: 'absolute',
    top: '100%',
    zIndex: 100,
  },
  Vipiska: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#94D8F4',
    fontSize: 16,
    marginTop: 5,
  },
});
