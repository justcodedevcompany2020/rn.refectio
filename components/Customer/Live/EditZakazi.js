import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import ArrowGrayComponent from '../../../assets/image/ArrowGray';
import CustomerMainPageNavComponent from '../CustomerMainPageNav';
import BlueButton from '../../Component/Buttons/BlueButton';
import MaskInput from 'react-native-mask-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from "expo-image-picker";
import Loading from '../../Component/Loading';
import {Modal} from 'react-native';
import {ImageBackground} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default class EditZakaziComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardOpen: false,

      done_time: '',
      done_time_error: false,

      given_time: '',
      given_time_error: false,

      name: '',
      name_error: false,

      photo: null,
      photo_error: false,

      photo_bool: true,
      isLoading: false,

      deleteTavarModal: false,
    };
  }

  pickImage = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 4],
    //   quality: 0.5,
    // });
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit:50
      // includeBase64: true,
    });
    if (!result.canceled) {
      this.setState({
        photo: result.assets[0].uri,
        photo_error: false,
        photo_bool: false,
      });
    }
  };

  UpdateordersDataFromManufacter = async () => {
    this.setState({isLoading: true});
    let token = await AsyncStorage.getItem('userToken');

    form_data = new FormData();
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);

    form_data.append('name', this.state.name);
    form_data.append('order_id', this.props.order_id);
    form_data.append('gatovnost', this.state.done_time);
    form_data.append('dostavka', this.state.given_time);

    if (this.state.photo) {
      console.log(this.state.photo_bool);
      form_data.append(
        'photo',
        !this.state.photo_bool
          ? {
              uri: this.state.photo,
              type: 'imarge/jpg',
              name: 'photo.jpg',
            }
          : this.state.photo,
      );
    }

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: form_data,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/UpdateordersDataFromManufacter`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === true) {
          this.props.navigation.navigate('LiveZakazchikSingl', {
            params: this.props.item_id,
          });
        } else {
          if (result.hasOwnProperty('name')) {
            this.setState({name_error: true});
          } else {
            this.setState({name_error: false});
          }
          if (result.hasOwnProperty('photo')) {
            this.setState({photo_error: true});
          } else {
            this.setState({photo_error: false});
          }
          if (result.hasOwnProperty('gatovnost')) {
            this.setState({done_time_error: true});
          } else {
            this.setState({done_time_error: false});
          }
          if (result.hasOwnProperty('dostavka')) {
            this.setState({given_time_error: true});
          } else {
            this.setState({given_time_error: false});
          }
        }
        this.setState({isLoading: false});
      })
      .catch(error => console.log('error', error));
  };

  SinglePageOrderFromManufacter = async () => {
    let token = await AsyncStorage.getItem('userToken');

    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
      order_id: this.props.order_id,
    });

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `https://admin.refectio.ru/public/api/SinglePageOrderFromManufacter`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        if (result.status === true) {
          let get_photo = result.data[0].order_photo[0].photo;
          this.setState({
            done_time: result.data[0].gatovnost,
            given_time: result.data[0].dostavka,
            name: result.data[0].name,
            photo: get_photo,
          });
        }
      })
      .catch(error => console.log('error', error));
  };

  componentDidMount() {
    const {navigation} = this.props;
    // this.getAuthUserProfile()

    this.focusListener = navigation.addListener('focus', () => {
      this.SinglePageOrderFromManufacter();
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
      console.log(' END');
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

  clearAllData = () => {
    this.setState({
      done_time: '',
      done_time_error: false,

      given_time: '',
      given_time_error: false,

      name: '',
      name_error: false,

      photo: null,
      photo_error: false,

      photo_bool: false,
    });
  };

  async onDeleteTavar() {
    const id = this.props.order_id;
    console.log(id);
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);
    await this.setState({isLoading: true, deleteTavarModal: false});
    await fetch(
      `https://admin.refectio.ru/public/api/delete_next_order/${id}`,
      {
        method: 'GET',
        headers: myHeaders,
      },
    )
      .then(response => response.json())
      .then(async res => {
        console.log(res);
        this.props.navigation.goBack();
      })
      .catch(error => error, 'error');
  }

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Заказы Live</Text>

          <Modal visible={this.state.deleteTavarModal}>
            <ImageBackground
              source={require('../../../assets/image/blurBg.png')}
              style={styles.blurBg}>
              <View style={styles.whiteBox}>
                <Text style={styles.info}>Желаете удалить данный товар?</Text>
                <TouchableOpacity
                  style={styles.buttonOk}
                  onPress={() => {
                    this.onDeleteTavar();
                  }}>
                  <Text style={styles.textOk}>Да</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dontShow}
                  onPress={() => {
                    this.setState({
                      deleteTavarModal: false,
                    });
                  }}>
                  <Text style={styles.dontShowText}>Отмена</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </Modal>

          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}>
              <View style={styles.imageEmptyParent}>
                <Text
                  style={[
                    styles.photoText,
                    this.state.photo_error
                      ? {color: 'red'}
                      : {color: '#333333'},
                  ]}>
                  Фото
                </Text>
                {this.state.photo === null ? (
                  <TouchableOpacity onPress={() => this.pickImage()}>
                    <Svg
                      width={85}
                      height={85}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <Rect
                        x={0.5}
                        y={0.5}
                        width={84}
                        height={84}
                        rx={17.5}
                        stroke={this.state.photo_error ? 'red' : '#767676'}
                      />
                      <Path
                        stroke={this.state.photo_error ? 'red' : '#000'}
                        d="M42.5 22v40M62 42.5H22"
                      />
                    </Svg>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.userIconParent}>
                    <Image
                      source={{
                        uri: !this.state.photo_bool
                          ? this.state.photo
                          : `https://admin.refectio.ru/public/uploads/` +
                            this.state.photo,
                      }}
                      style={styles.userIcon}
                      resizeMode={'contain'}
                    />

                    <TouchableOpacity
                      style={styles.delateImg}
                      onPress={() =>
                        this.setState({photo: null, photo_bool: false})
                      }>
                      <Svg
                        width={32}
                        height={32}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <Rect width={32} height={32} rx={16} fill="#378DFE" />
                        <Path
                          d="M9.413 10.21a.563.563 0 0 1 .796-.796l5.79 5.79 5.789-5.79a.563.563 0 0 1 .796.797L16.794 16l5.79 5.79a.563.563 0 1 1-.796.796l-5.79-5.79-5.788 5.79a.563.563 0 1 1-.797-.797L15.203 16l-5.79-5.79Z"
                          fill="#fff"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    deleteTavarModal: true,
                  })
                }>
                <Image
                  source={require('../../../assets/image/karzina.png')}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            </View>

            <View>
              <Text
                style={[
                  styles.nazvaniaText,
                  this.state.name_error ? {color: 'red'} : {color: '#333333'},
                ]}>
                Название
              </Text>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="Шкаф «Ансамбль»"
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

            <View style={styles.godnastParent}>
              <View style={{width: '47%'}}>
                <Text
                  style={[
                    styles.nazvaniaText,
                    this.state.done_time_error
                      ? {color: 'red'}
                      : {color: '#333333'},
                  ]}>
                  Дата готовности
                </Text>
                <MaskInput
                  underlineColorAndroid="transparent"
                  placeholder="22.08.2023"
                  keyboardType="number-pad"
                  style={[
                    styles.nazvania,
                    this.state.done_time_error
                      ? {borderColor: 'red'}
                      : {borderColor: '#F5F5F5'},
                  ]}
                  mask={[
                    /\d/,
                    /\d/,
                    '.',
                    /\d/,
                    /\d/,
                    '.',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                  value={this.state.done_time}
                  onChangeText={value => {
                    this.setState({done_time: value, done_time_error: false});
                  }}
                />
              </View>

              <View style={{width: '47%'}}>
                <Text
                  style={[
                    styles.nazvaniaText,
                    this.state.given_time_error
                      ? {color: 'red'}
                      : {color: '#333333'},
                  ]}>
                  Дата доставки
                </Text>
                <MaskInput
                  underlineColorAndroid="transparent"
                  placeholder="15.11.2023"
                  keyboardType="number-pad"
                  style={[
                    styles.nazvania,
                    this.state.given_time_error
                      ? {borderColor: 'red'}
                      : {borderColor: '#F5F5F5'},
                  ]}
                  mask={[
                    /\d/,
                    /\d/,
                    '.',
                    /\d/,
                    /\d/,
                    '.',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                  value={this.state.given_time}
                  onChangeText={value => {
                    this.setState({
                      given_time: value,
                      given_time_error: false,
                    });
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.ready}
              onPress={() => this.UpdateordersDataFromManufacter()}>
              <BlueButton name="Изменить" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.goBack}
              onPress={async () => {
                await this.props.navigation.navigate('LiveZakazchikSingl', {
                  params: this.props.item_id,
                });
              }}>
              <Text style={styles.goBackText}>Отмена</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
        {this.state.keyboardOpen === false && (
          <CustomerMainPageNavComponent
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
  pageTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 24,
    marginTop: 11,
    color: '#378DFE',
  },
  imageEmptyParent: {
    marginTop: 15,
  },
  photoText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
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
  userIconParent: {
    width: 85,
    height: 85,
    position: 'relative',
  },
  userIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  godnastParent: {
    width: '100%',
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ready: {
    alignSelf: 'center',
    marginTop: 100,
  },
  goBack: {
    marginTop: 12,
    borderWidth: 3,
    borderColor: '#B5D8FE',
    height: 44,
    width: 285,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackText: {
    fontFamily: 'Poppins_700Bold',
    color: '#B5D8FE',
    fontSize: 18,
  },
  delateImg: {
    position: 'absolute',
    right: -10,
    top: -10,
  },
  blurBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBox: {
    width: '90%',
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  info: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    textAlign: 'center',
    padding: 5,
    marginBottom: 20,
  },
  buttonOk: {
    width: '80%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B5D8FE',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 12,
  },
  textOk: {
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    fontSize: 18,
  },
  dontShow: {
    width: '80%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#B5D8FE',
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 43,
  },
  dontShowText: {
    color: '#B5D8FE',
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
});
