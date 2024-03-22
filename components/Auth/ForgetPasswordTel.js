import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  Touchable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import ArrowGrayComponent from "../../assets/image/ArrowGray";
import Svg, { Path, Rect } from "react-native-svg";
import BlueButton from "../Component/Buttons/BlueButton";
import AsyncStorage from "@react-native-async-storage/async-storage";


let timer = null;
export default class ForgetPasswordTelComponent extends Component {
  constructor(props) {
    super(props);

    this.pin1Ref = React.createRef();
    this.pin2Ref = React.createRef();
    this.pin3Ref = React.createRef();
    this.pin4Ref = React.createRef();

    this.state = {
      pin1: "",
      pin2: "",
      pin3: "",
      pin4: "",

      code: "",
      error_code: false,
      error_code_text: "",
      timerMinut: 1,
      timerSecond: 60,
      timerBool: false,
    };

    let interval = null;
  }

  sendPhoneCode = async () => {
    let myHeaders = new Headers();

    myHeaders.append("Content-Type", "multipart/form-data");
    await AsyncStorage.setItem("phoneCode", this.state.code);

    let formdata = new FormData();
    formdata.append("forgot_password_code", this.state.code);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    await fetch(`https://admin.refectio.ru/public/api/resetpasswordcode`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === true) {
          this.setState({
            error_code: false,
            pin1: "",
            pin2: "",
            pin3: "",
            pin4: "",
          });
          this.props.navigation.navigate("NewPassword");
        } else if (result.status === false) {
          if (result.hasOwnProperty("message")) {
            if (result.message == "code required") {
              this.setState({
                error_code: true,
                error_code_text: "Код обязателен для заполнения!",
                pin1: "",
                pin2: "",
                pin3: "",
                pin4: "",
              });
              this.pin1Ref.current.focus();
            } else if (result.message.message == "wrong verification code" || result.message == "invalid code") {
              this.setState({
                error_code: true,
                error_code_text: "Не верный код!",
                pin1: "",
                pin2: "",
                pin3: "",
                pin4: "",
              });
              this.pin1Ref.current.focus();
            }
            setTimeout(() => {
              this.setState({
                error_code_text: "",
                error_code: false,
              });
            }, 3000);
          }
        }
      })
      .catch((error) => console.log("error", error));
  };

  printTimer = () => {
    let timeer_second = this.state.timerSecond;
    let timer_minute = this.state.timerMinut;
    let time_result = "";

    if (timer_minute == 0) {
      time_result = "00:";

      let sec = "";
      if (timeer_second > 0 && timeer_second < 10) {
        sec = "0" + timeer_second;
      } else if (timeer_second > 10) {
        sec = timeer_second;
      }

      time_result = time_result + sec;
    } else {
      time_result = "01:00";
    }

    return time_result;
  };

  timer = () => {
    this.interval = setInterval(() => {
      if (this.state.timerSecond == 0) {
        clearInterval(this.interval);

        this.setState({
          timerMinut: 1,
          timerBool: true,
          timerSecond: 60,
        });

        console.log("STOP");

        return false;
      }

      this.setState({
        timerMinut: 0,
        timerSecond: this.state.timerSecond - 1,
      });
    }, 1000);
  };

  updateCodeSend = async () => {
    if (this.state.timerBool === true) {
      let myHeaders = new Headers();
      let storagePhone = await AsyncStorage.getItem("phone");
      myHeaders.append("Content-Type", "multipart/form-data");

      let formdata = new FormData();
      formdata.append("phone", storagePhone);

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };
      await fetch(`https://admin.refectio.ru/public/api/sendcodeforphone`, requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          if (result.status) {
            await this.setState({
              timerBool: true,
            });

            clearInterval(this.interval);
            this.timer();
          }
        });
    }
  };

  componentDidMount() {
    const { navigation } = this.props;

    clearInterval(this.interval);

    // this.timer()

    this.focusListener = navigation.addListener("focus", () => {
      let storagePhone = AsyncStorage.getItem("phone");

      clearInterval(this.interval);
      this.timer();
      // this.timer()
    });
  }

  goToBack = async () => {
    clearInterval(this.interval);
    await this.setState({
      timerMinut: 1,
      timerBool: false,
      timerSecond: 60,
    });
    this.props.navigation.navigate("ForgetPassword");
  };

  render() {
    const { pin1, pin2, pin3, pin4 } = this.state;
    return (
      <SafeAreaView
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 25 }}>
          <TouchableOpacity
            onPress={() => {
              this.goToBack();
            }}
            style={{
              position: "absolute",
              top: 18.29,
              left: 15,
              zIndex: 100,
            }}
          >
            <ArrowGrayComponent />
          </TouchableOpacity>

          <View>
            <View
              style={{
                marginTop: 86,
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  color: "#2D9EFB",
                  fontFamily: "Poppins_500Medium",
                  lineHeight: 30,
                }}
              >
                Восстановление{"\n"}аккаунта
              </Text>
            </View>

            <View>
              <Text
                style={{
                  color: "#52A8EF",
                  marginTop: 25,
                  lineHeight: 17.61,
                  fontFamily: "Raleway_500Medium",
                }}
              >
                Мы отправим 4-х значный код на ваш номер{"\n"}для подтверждения
                личности
              </Text>
            </View>

            <View>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  color: "#2D9EFB",
                  fontSize: 15,
                }}
              >
                {this.printTimer()}
              </Text>
            </View>

            <View style={styles.confirmView}>
              <TextInput
                ref={this.pin1Ref}
                value={pin1}
                style={styles.textInput}
                keyboardType="phone-pad"
                onChangeText={(pin1) => {
                  this.setState({ pin1 });
                  if (pin1.length) {
                    this.pin2Ref.current.focus();
                  } else {
                    this.pin1Ref.current.blur();
                  }
                }}
                maxLength={1}
              />
              <TextInput
                ref={this.pin2Ref}
                value={pin2}
                style={styles.textInput}
                keyboardType="phone-pad"
                onChangeText={(pin2) => {
                  this.setState({ pin2 });
                  if (pin2.length) {
                    this.pin3Ref.current.focus();
                  } else {
                    this.pin1Ref.current.focus();
                  }
                }}
                maxLength={1}
              />
              <TextInput
                ref={this.pin3Ref}
                value={pin3}
                style={styles.textInput}
                keyboardType="phone-pad"
                onChangeText={(pin3) => {
                  this.setState({ pin3 });
                  if (pin3.length) {
                    this.pin4Ref.current.focus();
                  } else {
                    this.pin2Ref.current.focus();
                  }
                }}
                maxLength={1}
              />
              <TextInput
                ref={this.pin4Ref}
                value={pin4}
                style={styles.textInput}
                keyboardType="phone-pad"
                onChangeText={(pin4) => {
                  this.setState({ pin4 });
                  if (pin4.length) {
                    this.pin4Ref.current.focus();
                  } else {
                    this.pin3Ref.current.focus();
                  }
                }}
                maxLength={1}
              />
            </View>
            {this.state.error_code === true && (
              <View>
                <Text style={{ paddingLeft: 25, color: "red" }}>
                  {this.state.error_code_text}
                </Text>
              </View>
            )}
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={async () => {
                await this.updateCodeSend();
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 8,
                  textAlign: "center",
                  color: "#B5D8FE",
                  textDecorationLine: "underline",
                  textDecorationStyle: "solid",
                  textDecorationColor: "#B5D8FE",
                  fontFamily: "Raleway_500Medium",
                }}
              >
                Отправить код повторно
              </Text>
            </TouchableOpacity>
            <View
              style={{
                alignItems: "center",
                marginTop: 36,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  await this.setState({ code: pin1 + pin2 + pin3 + pin4 });

                  await this.sendPhoneCode();
                }}
              >
                <BlueButton name="Подтвердить" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    width: 50,
    height: 60,
    borderRadius: 8,
    paddingHorizontal: 18,
    borderColor: "#F5F5F5",
    borderWidth: 2,
  },
  confirmView: {
    marginHorizontal: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalVisible: {
    flex: 1,
    alignItems: "center",
  },
});
