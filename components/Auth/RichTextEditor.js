import React, {useRef, useState} from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
import {ImageBackground} from 'react-native';
import {Modal} from 'react-native';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
// import BlueButton from "../Component/Buttons/BlueButton";
// import { useNavigation } from "@react-navigation/native";

export default function RichTextEditorComponent({
  value,
  hideIcon,
  hideText,
  navigation,
}) {
  // const navigation = useNavigation();
  // const richText = useRef(null)
  // const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>
  // const htmlStr = '<p><i><u>Underline italic text</u></i> <b>bold word</b> normal words</p>';
  // const initialCSSText = { contentCSSText: `font-size: 36px` }

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  console.log(value, 'vaal');
  // Truncate the 'value' to a specific length
  const truncatedValue = truncateText(value, 150); // Change '50' to your desired length

  const htmlContent = `<div style='margin-bottom:20px'  ><p>${truncatedValue}</p></div>`;

  return (
    <SafeAreaView>
      {hideText ? null : (
        <Text style={{color: 'lightgrey', marginBottom: 10}}>
          *Редактирование текста возможно через сайт www.refectio.ru
        </Text>
      )}
      {hideIcon ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: 'lightgrey',
            borderRadius: 6,
            position: 'relative',
            marginRight: 12,
            height: '70%',
            // padding: 10,
            // width: height === 200 ? "87%" : "",
          }}>
          <WebView
            source={{
              html:
                value == null || value == 'null' || value == '<p><br></p>'
                  ? hideText
                    ? `<div style= "font-size: 40px; color: lightgray">Производитель не добавил доп. информацию</div>`
                    : `<div style= "font-size: 40px; color: lightgray">Добавьте доп информацию</div>`
                  : `<div style="font-size:50px;">${value}</div>`,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            borderWidth: 1,
            borderColor: '#F5F5F5',
            borderRadius: 6,
            // height: 50,

            // justifyContpaddent: "center",
          }}>
          {value?.length > 0 ? (
            // <View
            //   style={{
            //     flexDirection: "row",
            //     // alignItems: "center",
            //     // justifyContent: "space-between",
            //     // marginLeft: 10,

            //     width: "100%",
            //   }}
            // >
            //   <View style={{ width: "70%", height: 300, position: "relative" }}>
            //     <HTML
            //       contentWidth={300}
            //       source={{
            //         html: htmlContent,
            //       }}
            //     />
            //   </View>
            //   <TouchableOpacity
            //     style={{ position: "absolute", top: 0, right: 20 }}
            //     onPress={() =>
            //       navigation.navigate("AboutUsScreen", { value: value })
            //     }
            //   >
            //     <Image
            //       source={require("../../assets/image/imageblue.png")}
            //       style={{
            //         alignSelf: "flex-end",
            //         width: 30,
            //         height: 30,
            //         marginRight: 5,
            //       }}
            //     />
            //   </TouchableOpacity>
            // </View>
            <View
              style={{
                // flexDirection: "row",
                width: '100%',
                flexDirection: 'row',
                // // position: "relative",
                alignItems: 'center',
                justifyContent: 'space-between',
                // height: 200,
                // alignItems: "center",
                // marginTop: 15,
                // borderWidth: 0,
                paddingHorizontal: 10,
                height: 100,
              }}>
              <View
                style={{
                  // borderWidth: 1,
                  // borderColor: "#F5F5F5",
                  // borderRadius: 6,
                  // position: "relative",
                  // marginRight: 12,
                  // alignSelf: "flex-start",
                  width: '87%',
                  // paddingHorizoԴntal: 20,
                  // height: 50,
                }}>
                <HTML
                  contentWidth={900}
                  // height={100}
                  source={{
                    html: htmlContent,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AboutUsScreen', {
                    value: value,
                  });
                }}>
                <Image
                  source={require('../../assets/image/imageblue.png')}
                  style={{
                    alignSelf: 'flex-end',
                    width: 30,
                    height: 30,
                    marginRight: 5,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            ''
          )}
        </View>
      )}
      {/* {height === 200 && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AboutUsScreen", {
              value: value,
              hideText: true,
            });
          }}
        >
          <Image
            source={require("../../assets/image/image.png")}
            style={{
              alignSelf: "flex-end",
              width: 30,
              height: 30,
              marginRight: 5,
            }}
          />
        </TouchableOpacity>
      )} */}

      {/*   */}

      {/*  <View
              style={{
                flexDirection: "row",
                width: "100%",
                flexDirection: "row",
                position: "relative",
                height: 100,
                // alignItems: "center",
                // marginTop: 15,
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#F5F5F5",
                  borderRadius: 6,
                  position: "relative",
                  marginRight: 12,
                  width: "100%",
                  paddingHorizontal: 20,
                  height: 100,
                }}
              >
                <HTML
                  contentWidth={100}
                  height={100}
                  source={{
                    html: `<div style="font-size: 16px">${value}</div>`,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AboutUsScreen", {
                    value: this.state.about_us,
                  });
                }}
              >
                <Image
                  source={require("../../assets/image/ep_edit.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </TouchableOpacity>
            </View> */}
    </SafeAreaView>
  );
}
