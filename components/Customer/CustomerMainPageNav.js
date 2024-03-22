import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../AuthContext/context";

export default class CustomerMainPageNavComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navBar: [
        {
          images: require("../../assets/image/home.png"),
          text: "Главная",
          change: "CustomerMainPage",
          id: 1,
        },
        {
          images: require("../../assets/image/LIVE.png"),
          text: "Заказы",
          change: "ZakaziLive",
          id: 2,
        },
        // {
        //   images: require("../../assets/image/dizayneri.png"),
        //   text: "Дизайнеры",
        //   change: "CheckDesigner",
        //   id: 3,
        // },
        // {
        //   images: require("../../assets/image/broni.png"),
        //   text: "Брони",
        //   change: "CustomerMyBroni",
        //   id: 4,
        // },
        {
          images: require("../../assets/image/Menu.png"),
          text: "Поиск",
          change: "SearchScreen",
          id: 3,
        },
        {
          images: require("../../assets/image/carbon_user-avatar.png"),
          text: "Профиль",
          change: "CustomerMyAccaunt",
          id: 4,
        },
      ],
    };
  }
  static contextType = AuthContext;

  goToPages = (e) => {
    this.props.navigation.navigate(e);
  };


  componentDidMount() {
    console.log(this.context.notify_count, 'CustomerMainPageNav')
  }

  render() {
    return (
      <View style={styles.navBar}>
        {this.state.navBar.map((item, index) => {
          return (
            <TouchableOpacity
              style={{ alignItems: "center", width: "20%" }}
              onPress={() => this.goToPages(item.change)}
              key={index}
            >
              {(item.text == 'Заказы' && this.context.notify_count > 0) && <View style={{ height: 13, width: 13, backgroundColor: 'red', borderRadius: 50, position: 'absolute', right: 0, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 9.5 }}>{this.context.notify_count}</Text>
              </View>}
              <Image
                source={item.images}
                style={[
                  this.props.active_page == item.text
                    ? styles.navIconsActive
                    : styles.navIcons,
                  index === 1
                    ? {
                      width: 40,
                      height: 14,
                      resizeMode: "contain",
                      marginBottom: 5,
                      marginTop: 9,
                    }
                    : { width: 25, height: 25 },
                ]}
              />

              <Text
                key={index}
                style={[
                  this.props.active_page == item.text
                    ? styles.navTextActive
                    : styles.navText,
                  { fontSize: 10 },
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopWidth: 3,
    borderTopColor: "#00000010",
  },
  navIcons: {
    tintColor: "#44BBEB",
    marginTop: 4,
  },
  navIconsActive: {
    tintColor: "#52A8EF",
    marginTop: 4,
  },
  navText: {
    color: "#000",
    fontSize: 10,
    // fontFamily: 'Poppins_500Medium',
    fontWeight: "500",
  },
  navTextActive: {
    color: "#52A8EF",
    fontSize: 10,
    // fontFamily: 'Poppins_500Medium',
    fontWeight: "500",
  },
});
