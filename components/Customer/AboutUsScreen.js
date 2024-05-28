import React, {useEffect, useState, useRef} from 'react';
import {Dimensions, View, ScrollView, Image} from 'react-native';
import {SafeAreaView} from 'react-native';
import CustomerMainPageNavComponent from './CustomerMainPageNav';
import {Keyboard} from 'react-native';
import {BackBtn} from '../search/customer/CategoryScreen';
import {Text} from 'react-native';
import RichTextEditorComponent from '../Auth/RichTextEditor';
import {TouchableOpacity} from 'react-native';
import BlueButton from '../Component/Buttons/BlueButton';
import HTML from 'react-native-render-html';

const {width: screenWidth} = Dimensions.get('window');
export default function AboutUsScreen({navigation, value, hideText, meshok}) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [aboutUs, setAboutUs] = useState(value);
  const webViewRef = useRef(null);
  const [newtx, setNewtxt] = useState('');

  useEffect(() => {
    if (aboutUs != null) {
      const modifiedHtmlString = aboutUs
        .replace(/<p>/g, '<span>')
        .replace(/<\/p>/g, '</span><br>');
      setNewtxt(modifiedHtmlString);
    }
  }, [aboutUs]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  console.log(meshok, 'meshol');
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {aboutUs?.length > 0 &&
      aboutUs != 'null' &&
      aboutUs != 'undefined' &&
      aboutUs != '<p><br></p>' ? (
        <View
          style={{
            flex: 1,
          }}>
          <View style={{marginLeft: 15}}>
            <BackBtn onPressBack={() => navigation.goBack()} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: meshok == 'no' ? 'flex-start' : 'flex-end',
                width: '100%',
                alignItems: 'center',
                marginTop:
                  meshok == 1 || meshok == 2 || meshok == 3 || meshok == 4
                    ? -20
                    : 20,
              }}>
              {meshok == 1 ? (
                <Image
                  style={{width: 60, height: 60}}
                  source={require('../../assets/image/price1.png')}
                />
              ) : meshok == 2 ? (
                <Image
                  style={{width: 60, height: 60}}
                  source={require('../../assets/image/price2.png')}
                />
              ) : meshok == 3 ? (
                <Image
                  style={{width: 60, height: 60}}
                  source={require('../../assets/image/price3.png')}
                />
              ) : meshok == 4 ? (
                <Image
                  style={{width: 60, height: 60}}
                  source={require('../../assets/image/price4.png')}
                />
              ) : meshok == 'no' ? (
                <Text
                  style={{
                    marginVertical: 20,
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'Poppins_500Medium',
                  }}>
                  Дополнительная информация
                </Text>
              ) : (
                ''
              )}
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                flexDirection: 'row',
                position: 'relative',
              }}>
              <View
                style={{
                  position: 'relative',
                  marginRight: 12,
                  width: screenWidth,
                  paddingHorizontal: 10,
                }}>
                <HTML
                  contentWidth={700}
                  source={{
                    html: `<div style="font-size: 16px; color:black">${
                      aboutUs ? aboutUs : ''
                    }</div>`,
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                marginTop: 40,
                marginBottom: 20,
              }}
              disabled={disabled}
              onPress={() => navigation.goBack()}>
              <BlueButton name="Ок" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
          }}>
          <BackBtn onPressBack={() => navigation.goBack()} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: meshok == 'no' ? 'flex-start' : 'flex-end',
              width: '100%',
              alignItems: 'center',
              marginTop:
                meshok == 1 || meshok == 2 || meshok == 3 || meshok == 4
                  ? -20
                  : 20,
            }}>
            {meshok == 1 ? (
              <Image
                style={{width: 60, height: 60}}
                source={require('../../assets/image/price1.png')}
              />
            ) : meshok == 2 ? (
              <Image
                style={{width: 60, height: 60}}
                source={require('../../assets/image/price2.png')}
              />
            ) : meshok == 3 ? (
              <Image
                style={{width: 60, height: 60}}
                source={require('../../assets/image/price3.png')}
              />
            ) : meshok == 4 ? (
              <Image
                style={{width: 60, height: 60}}
                source={require('../../assets/image/price4.png')}
              />
            ) : meshok == 'no' ? (
              <Text
                style={{
                  marginVertical: 20,
                  fontSize: 20,
                  color: 'black',
                  fontFamily: 'Poppins_500Medium',
                }}>
                Дополнительная информация
              </Text>
            ) : (
              ''
            )}
          </View>

          {/* */}
          <RichTextEditorComponent
            value={aboutUs}
            hideIcon
            hideText={hideText}
            // height={"70%"}
          />
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              position: 'absolute',
              bottom: '10%',
            }}
            disabled={disabled}
            onPress={() => navigation.goBack()}>
            <BlueButton name="Ок" />
          </TouchableOpacity>
        </View>
      )}
      <View></View>
      {!isKeyboardVisible && (
        <CustomerMainPageNavComponent
          active_page={'Поиск'}
          navigation={navigation}
        />
      )}
    </SafeAreaView>
  );
}
