import React, {useEffect, useState, useRef} from 'react';
import {Dimensions, View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native';
import {StyleSheet} from 'react-native';
import Loading from '../Component/Loading';
import CustomerMainPageNavComponent from './CustomerMainPageNav';
import {Keyboard} from 'react-native';
import {BackBtn} from '../search/customer/CategoryScreen';
import {Text} from 'react-native';
import RichTextEditorComponent from '../Auth/RichTextEditor';
import {TouchableOpacity} from 'react-native';
import BlueButton from '../Component/Buttons/BlueButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';

const {width: screenWidth} = Dimensions.get('window');
export default function AboutUsScreen({navigation, value, hideText}) {
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
      console.log(modifiedHtmlString);
    }
  }, [aboutUs]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {aboutUs?.length > 0 &&
      aboutUs != 'null' &&
      aboutUs != 'undefined' &&
      aboutUs != '<p><br></p>' ? (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
          }}>
          <View>
            <BackBtn onPressBack={() => navigation.goBack()} />
            <Text
              style={{
                marginVertical: 20,
                fontSize: 20,
                fontFamily: 'Poppins_500Medium',
              }}>
              Дополнительная информация
            </Text>
          </View>
          <ScrollView>
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
                }}>
                <WebView
                  ref={webViewRef}
                  style={{
                    width: screenWidth,
                    zIndex: 99999,
                    flex: 1,
                    overflow: 'hidden',
                    height:
                      aboutUs.length >= 1000
                        ? aboutUs.length - 200
                        : aboutUs.length + 100,
                  }}
                  source={{
                    html: `<div style="font-size:50px; overflow: hidden; height:auto; width:1000">${newtx}</div>`,
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                marginTop: aboutUs.length > 1440 ? -170 : 20,
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
          <Text
            style={{
              marginVertical: 20,
              fontSize: 20,
              // textAlign: "center/",
              // color: "#2D9EFB",
              fontFamily: 'Poppins_500Medium',
            }}>
            Дополнительная информация
          </Text>
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

      {!isKeyboardVisible && (
        <CustomerMainPageNavComponent
          active_page={'Поиск'}
          navigation={navigation}
        />
      )}
    </SafeAreaView>
  );
}
