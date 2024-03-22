import React from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CloseIcon from '../slider/CloseIcon';

const AppUpdateAvailable = ({navigation, path}) => {
  const pathName = path.path;

  return (
    <>
      <SafeAreaView style={{backgroundColor: 'transparent'}} />
      {/* <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{alignSelf: 'flex-end', paddingTop: 20, paddingRight: 20}}>
          <CloseIcon
            onPress={() =>
              navigation.canGoBack()
                ? navigation.goBack()
                : navigation.navigate(pathName)
            }
            color={'#7e7e7e'}
          />
        </View>
        <Image
          style={{width: '100%', height: '65%'}}
          resizeMode="cover"
          source={require('../../assets/image/photoMob.png')}
        />

        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              textAlign: 'center',
              marginTop: 10,
            }}>
            В приложении удобнее
          </Text>
          <Text
            style={{
              textAlign: 'center',
              paddingHorizontal: 20,
              marginTop: 10,
              fontSize: 15,
            }}>
            смотреть фото и описания.{'\n'} Есть фильтры и возможность смотреть
            подходящие примеры работ сразу от многих производителей.
          </Text>
        </View>
        <View style={{width: '100%', paddingHorizontal: 20}}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                Platform.OS === 'ios'
                  ? process.env.APP_STORE_URL
                  : process.env.PLAY_STORE_URL,
              );
            }}
            style={{
              width: '100%',
              borderRadius: 15,
              backgroundColor: '#B5D8FE',
              height: 50,
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 18, color: 'white', fontWeight: '700'}}>
              Скачать
            </Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </>
  );
};

export default AppUpdateAvailable;

const styles = StyleSheet.create({});
