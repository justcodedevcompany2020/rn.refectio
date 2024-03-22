import React from 'react';
import {
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LoadingAdd from '../Component/LoadingAdd';
import ArrowGrayComponent from '../../assets/image/ArrowGray';
import BlueButton from '../Component/Buttons/BlueButton';
import CustomerMainPageNavComponent from './CustomerMainPageNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import RichTextEditorComponent from '../Auth/RichTextEditor';
import Loading from '../Component/Loading';
import ImageWithLoadingIndicator from './ImageWithLoading';

export default class EditProductComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardOpen: false,
      categoryName: '',
      categoryId: '',
      parentCategoryName: null,
      parentCategoryId: null,
      img: null,
      buttonBlue: false,
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
      alldata: [],
      tabletop: '',
      tabletop_error: false,
      all_images: [],
      all_images_error: false,
      get_old_image: [],
      categoryArray: [],

      modalBool: false,

      buttonSend: true,

      limitError: false,

      delate_photo: [],
      isLoading: false,

      hasFacades: false,
      hasFrame: false,
      hasTableTop: false,
      hasLength: false,
      hasHeight: false,
      hasProfile: false,
      hasMaterial: false,

      max_image_error: false,
    };
    this.delate_images = [];
    this.richText = React.createRef();
  }

  handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>;

  // pickImage = async () => {
  //   const result = await launchImageLibrary({
  //     mediaType: 'photo',
  //     quality: 1,
  //     selectionLimit: 50,
  //     // includeBase64: true,
  //   });
  //   if (!result.canceled) {
  //     this.setState({img: result.assets[0].uri, all_images_error: false});
  //   } else {
  //     this.setState({all_images_error: true});
  //   }

  //   let all_images = this.state.all_images;
  //   if (result.hasOwnProperty('assets')) {
  //     await result.assets.map((element, index) => {
  //       all_images.push({
  //         uri: element.uri,
  //         type: 'image/jpg',
  //         name: 'photo.jpg',
  //       });
  //     });
  //   } else {
  //     all_images.push({
  //       uri: result.assets[0].uri,
  //       type: 'image/jpg',
  //       name: 'photo.jpg',
  //     });
  //   }

  //   this.setState({
  //     all_images: all_images,
  //     all_images_error: false,
  //   });
  // };

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

  delateSelectedNewImage = async index => {
    let {all_images} = this.state;

    let new_all_images = [];

    if (all_images?.length + this.state.get_old_image?.length <= 11) {
      this.setState({max_image_error: false});
    }

    for (let i = 0; i < all_images?.length; i++) {
      if (i == index) {
        continue;
      }
      new_all_images.push(all_images[i]);
    }
    this.setState({
      all_images: new_all_images,
    });
  };

  delateSelectedOldImage = async (item, index) => {
    let {get_old_image, all_images} = this.state;

    let new_all_images = [];

    if (all_images?.length + this.state.get_old_image?.length <= 11) {
      this.setState({max_image_error: false});
    }

    for (let i = 0; i < get_old_image.length; i++) {
      if (i == index) {
        this.delate_images.push(get_old_image[i]);
      } else {
        new_all_images.push(get_old_image[i]);
      }
    }
    this.setState({
      delate_photo: this.delate_images,
      get_old_image: new_all_images,
    });
  };

  clearAllData = async () => {
    await this.setState({
      name: '',
      name_error: false,

      frame: '',
      frame_error: false,

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

      categoryChanged: '',
      // modalBool: false,
      get_old_image: [],

      limitError: false,

      keyboardOpen: false,
      categoryName: '',
      // categoryChanged: "",
      // categoryChanged_error: "",
      categoryId: '',
      parentCategoryName: null,
      parentCategoryId: null,
      img: null,

      all_images_error: false,

      categoryArray: [],

      modalBool: false,

      buttonSend: true,

      image_boolean: false,

      hasFacades: false,
      hasFrame: false,
      hasTableTop: false,
      hasLength: false,
      hasHeight: false,
      hasProfile: false,
      hasMaterial: false,
    });
  };

  sendProduct = async () => {
    this.setState({isLoading: true, buttonBlue: true});
    let {all_images, delate_photo, get_old_image} = this.state;
    Keyboard.dismiss();
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    console.log(userToken);
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);
    myHeaders.append('Content-Type', 'multipart/form-data');

    let formdata = new FormData();
    formdata.append('product_id', this.props.user_id.product_id);

    if (
      this.state.parentCategoryId == 'null' ||
      this.state.parentCategoryId == null
    ) {
      formdata.append('parent_category_id', this.state.categoryId);
      formdata.append('parent_category_name', this.state.categoryName);
    } else {
      formdata.append('parent_category_id', this.state.parentCategoryId);
      formdata.append('parent_category_name', this.state.parentCategoryName);

      formdata.append('category_id', this.state.categoryId);
      formdata.append('category_name', this.state.categoryName);
    }

    formdata.append('name', this.state.name);
    formdata.append('frame', this.state.frame);
    formdata.append('facades', this.state.facades);
    formdata.append('length', this.state.length);
    formdata.append('height', this.state.height);
    let myPrice = this.state.price.replaceAll('.', '');
    formdata.append('price', myPrice);
    formdata.append('tabletop', this.state.tabletop);
    formdata.append('material', this.state.material);
    formdata.append('profile', this.state.profile);
    formdata.append('about', this.state.about);

    if (delate_photo.length > 0) {
      await delate_photo.map(item => {
        formdata.append('Deletephoto[]', item.id);
      });
    }

    if (all_images.length > 0) {
      await all_images.map((element, index) => {
        formdata.append('photo[]', element);
      });
      if (all_images.length + get_old_image.length === 0) {
        this.setState({buttonSend: false, all_images_error: true});
      }
      if (
        all_images.length > 0 &&
        get_old_image.length > 0 &&
        // all_images.length + get_old_image.length <= 5 &&
        this.state.name !== ''
        // this.state.categoryChanged !== ""
      ) {
        this.setState({buttonSend: true, max_image_error: false});
      }
    } else if (all_images.length === 0 && get_old_image.length === 0) {
      this.setState({buttonSend: false, all_images_error: true});
    }

    if (all_images.length > 10) {
      this.setState({limitError: true});
      return;
    } else {
      this.setState({limitError: false});
    }

    if (this.state.buttonSend) {
      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      await fetch(
        `https://admin.refectio.ru/public/api/UpdateProduct`,
        requestOptions,
      )
        .then(response => response.json())
        .then(async result => {
          console.log(result, 'res');
          if (result.status === true) {
            (await this.setState({
              buttonBlue: false,
              buttonSend: false,
              modalBool: true,
              isLoading: false,
            })) && (await this.clearAllData());
          } else if (result.status !== true) {
            this.setState({
              buttonBlue: true,
            });
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
          }
          formdata = new FormData();
          this.setState({isLoading: false});
        })
        .catch(error => console.log('error', error));
    }
  };

  getPrevOrdersData = async () => {
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
      product_id: this.props.user_id?.product_id,
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/SinglePageProductFromUpdate`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === true) {
          // console.log(result)
          console.log('asdasdasdasda', result);
          this.setState({alldata: result.data[0]});
          this.setState({
            name:
              result.data[0].name === 'null' || result.data[0].name === null
                ? ''
                : result.data[0].name,

            frame:
              result.data[0].frame === 'null' || result.data[0].frame === null
                ? ''
                : result.data[0].frame,

            facades:
              result.data[0].facades === 'null' ||
              result.data[0].facades === null
                ? ''
                : result.data[0].facades,

            height:
              result.data[0].height === 'null' || result.data[0].height === null
                ? ''
                : result.data[0].height,

            length:
              result.data[0].length === 'null' || result.data[0].length === null
                ? ''
                : result.data[0].length,

            price:
              result.data[0].price === 'null' || result.data[0].price === null
                ? ''
                : result.data[0].price
                    .toString()
                    .split('.')
                    .join('')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'),

            material:
              result.data[0].material === 'null' ||
              result.data[0].material === null
                ? ''
                : result.data[0].material,
            inserciones:
              result.data[0].inserciones === 'null' ||
              result.data[0].inserciones === null
                ? ''
                : result.data[0].inserciones,
            tabletop:
              result.data[0].tabletop === 'null' ||
              result.data[0].tabletop === null
                ? ''
                : result.data[0].tabletop,
            profile:
              result.data[0].profile === 'null' ||
              result.data[0].profile === null
                ? ''
                : result.data[0].profile,
            categoryName: result.data[0].category_name ?? null,
            parentCategoryName: result.data[0].parent_category_name,
            categoryId: result.data[0].category_id ?? null,
            parentCategoryId: result.data[0]?.parent_category_id,
            about:
              result.data[0].about == 'null' ||
              result.data[0].about == null ||
              result.data[0].about == '<p><br></p>'
                ? null
                : result.data[0].about,
            hasFacades:
              result.data[0].category_id == 41 ||
              result.data[0].category_id == 28 ||
              result.data[0].category_id == 30 ||
              result.data[0].category_id == 31 ||
              result.data[0].category_id == 36 ||
              // result.data[0].category_id.parent_category_id == 4 ||
              result.data[0].category_id == 42 ||
              result.data[0].category_id == 40 ||
              result.data[0].category_id == 66 ||
              result.data[0].category_id == 43 ||
              result.data[0].category_id == 45 ||
              result.data[0].category_id == 46 ||
              result.data[0].category_id == 50 ||
              result.data[0].category_id == 51 ||
              result.data[0].category_id == 57 ||
              result.data[0].category_id == 63 ||
              result.data[0].category_id == 58 ||
              result.data[0].category_id == 65,
            hasFrame:
              result.data[0].category_id == 28 ||
              result.data[0].category_id == 30 ||
              result.data[0].category_id == 57 ||
              result.data[0].category_id == 31 ||
              result.data[0].category_id == 36 ||
              result.data[0].category_id == 37 ||
              result.data[0].category_id == 42 ||
              result.data[0].category_id == 41 ||
              // result.data[0].category_id.parent_category_id == 4 ||
              result.data[0].category_id == 40 ||
              result.data[0].category_id == 43 ||
              result.data[0].category_id == 94 ||
              result.data[0].category_id == 45 ||
              result.data[0].category_id == 46 ||
              result.data[0].category_id == 50 ||
              result.data[0].category_id == 51 ||
              result.data[0].category_id == 95 ||
              result.data[0].category_id == 58 ||
              result.data[0].category_id == 96 ||
              result.data[0].category_id == 63 ||
              result.data[0].category_id == 97 ||
              result.data[0].category_id == 65 ||
              result.data[0].category_id == 66 ||
              result.data[0].category_id == 98,
            hasTableTop:
              result.data[0].category_id == 28 ||
              result.data[0].category_id == 30 ||
              result.data[0].category_id == 40 ||
              result.data[0].category_id == 50,
            hasLength:
              result.data[0].category_id == 28 ||
              result.data[0].category_id == 30 ||
              result.data[0].category_id == 31 ||
              result.data[0].category_id == 36 ||
              result.data[0].category_id == 37 ||
              result.data[0].category_id == 40 ||
              result.data[0].category_id == 41 ||
              // result.data[0].category_id.parent_category_id == 4 ||
              result.data[0].category_id == 42 ||
              result.data[0].category_id == 43 ||
              result.data[0].category_id == 94 ||
              result.data[0].category_id == 45 ||
              result.data[0].category_id == 46 ||
              result.data[0].category_id == 50 ||
              result.data[0].category_id == 51 ||
              result.data[0].category_id == 95 ||
              result.data[0].category_id == 57 ||
              result.data[0].category_id == 58 ||
              result.data[0].category_id == 96 ||
              result.data[0].category_id == 63 ||
              result.data[0].category_id == 97 ||
              result.data[0].category_id == 65 ||
              result.data[0].category_id == 66 ||
              result.data[0].category_id == 98,
            hasHeight:
              result.data[0].category_id == 31 ||
              result.data[0].category_id == 36 ||
              result.data[0].category_id == 37 ||
              // result.data[0].category_id == 40 ||
              result.data[0].category_id == 41 ||
              result.data[0].category_id == 43 ||
              result.data[0].category_id == 94 ||
              result.data[0].category_id == 50 ||
              result.data[0].category_id == 51 ||
              result.data[0].category_id == 95 ||
              result.data[0].category_id == 57 ||
              result.data[0].category_id == 58 ||
              result.data[0].category_id == 96 ||
              result.data[0].category_id == 97 ||
              result.data[0].category_id == 63 ||
              result.data[0].category_id == 66 ||
              result.data[0].category_id == 98,
            hasMaterial:
              result.data[0].category_id == 28 ||
              result.data[0].category_id == 30 ||
              result.data[0].category_id == 31 ||
              result.data[0].category_id == 36 ||
              result.data[0].category_id == 37 ||
              // result.data[0].category_id.parent_category_id == 4 ||
              result.data[0].category_id == 40 ||
              result.data[0].category_id == 41 ||
              result.data[0].category_id == 42 ||
              result.data[0].category_id == 43 ||
              result.data[0].category_id == 45 ||
              result.data[0].category_id == 46 ||
              result.data[0].category_id == 50 ||
              result.data[0].category_id == 51 ||
              result.data[0].category_id == 57 ||
              result.data[0].category_id == 58 ||
              result.data[0].category_id == 63 ||
              result.data[0].category_id == 65 ||
              result.data[0].category_id == 66 ||
              result.data[0].category_id == 94 ||
              result.data[0].category_id == 95 ||
              result.data[0].category_id == 96 ||
              result.data[0].category_id == 97 ||
              result.data[0].category_id == 98,

            hasProfile:
              result.data[0].category_id == 37 ||
              result.data[0].category_id == 94 ||
              result.data[0].category_id == 95 ||
              result.data[0].category_id == 96 ||
              result.data[0].category_id == 97 ||
              result.data[0].category_id == 98,
          });

          let new_all_images = [];
          result.data[0].product_image.map(item => {
            new_all_images.push(item);
          });
          this.setState({get_old_image: new_all_images});
        }
        this.setState({isLoading: false});
      })
      .catch(error => console.log('error', error));
  };

  componentDidMount() {
    const {navigation} = this.props;

    this.focusListener = navigation.addListener('focus', () => {
      this.getPrevOrdersData();
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
      // console.log(' END');
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

  render() {
    // console.log(this.state.alldata, "allllll");
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
                Вы успешно{'\n'}изменили продукт
              </Text>

              <TouchableOpacity
                style={{marginTop: 170}}
                onPress={async () => {
                  await this.props.navigation.navigate('Praductia', {
                    params: this.props.user_id.user_id,
                  });
                  await this.clearAllData();
                }}>
                <BlueButton name="В каталог" />
              </TouchableOpacity>
            </View>
          </Modal>

          <TouchableOpacity
            onPress={async () => {
              // console.log(this.props);
              await this.props.navigation.navigate('Praductia', {
                params: this.props.user_id.user_id,
              });
              await this.clearAllData();
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
              Изменения продукции
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
                ]}>
                Категория*
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
                  ]}>
                  <Text
                    style={{
                      color: '#5B5B5B',
                      fontFamily: 'Poppins_500Medium',
                    }}>
                    {this.state.parentCategoryName}
                    {this.state.categoryName != 'null' &&
                      this.state.categoryName != null &&
                      ' -> ' + this.state.categoryName}
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
                  keyboardType="default"
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
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
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
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
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  value={this.state.frame}
                  onChangeText={text => this.setState({frame: text})}
                />
              </View>
            ) : null}

            {/* Профиль */}
            {this.state.hasProfile && (
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
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  value={this.state.profile}
                  onChangeText={text => this.setState({profile: text})}
                />
              </View>
            )}

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
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
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
                  style={{
                    borderWidth: 1,
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
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                  }}
                  value={this.state?.length}
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
                  keyboardType="number-pad"
                  maxLength={9}
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '89%',
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                  value={this.state.price}
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

            {/* image */}
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
                  fontFamily: 'Poppins_500Medium',
                }}>
                Загрузить
              </Text>
            </TouchableOpacity>
            <View style={{width: '100%', alignItems: 'flex-start'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {this.state.get_old_image.length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 120,
                      alignItems: 'center',
                      marginTop: 30,
                    }}>
                    {this.state.get_old_image?.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            marginRight: 10,
                            position: 'relative',
                            width: 100,
                            height: 100,
                          }}>
                          <Image
                            source={{
                              uri:
                                `https://admin.refectio.ru/storage/app/uploads/` +
                                item.image,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              resizeMode: 'cover',
                            }}
                          />

                          <TouchableOpacity
                            onPress={() => {
                              this.delateSelectedOldImage(item, index);
                            }}
                            style={{
                              width: 20,
                              height: 20,
                              position: 'absolute',
                              right: 5,
                              top: 5,
                              backgroundColor: 'white',
                              borderRadius: 100,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={require('../../assets/image/ixs.png')}
                              style={{width: 10, height: 10}}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
                {this.state.all_images.length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 120,
                      alignItems: 'center',
                      marginTop: 30,
                    }}>
                    {this.state.all_images?.map((item, index) => {
                      return (
                        <ImageWithLoadingIndicator
                          key={index}
                          source={{uri: item.uri}}
                          onDelete={this.delateSelectedImage}
                          index={index}
                        />
                      );
                    })}
                  </View>
                )}
              </ScrollView>
            </View>
            {this.state.limitError === true && (
              <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>
                На данный момент можно загружать не более 10 фото по одному
                товару.
              </Text>
            )}
         
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins_500Medium',
                marginTop: 15,
                color: '#5B5B5B',
              }}>
              Дополнительная информация
            </Text>
            <View>
              <RichTextEditorComponent
                value={this.state.about}
                navigation={this.props.navigation}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
             
                  this.sendProduct();
             
              }}
              style={{
                alignSelf: 'center',
                marginTop: 60,
                marginBottom: 350,
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
                  Изменить
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
