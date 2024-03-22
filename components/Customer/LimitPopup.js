import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import BlueButton from "../Component/Buttons/BlueButton";
import { ImageBackground } from "react-native";

export default function LimitPopup({ modalVisible, onPressOk }) {

    return <Modal visible={modalVisible}>
        <ImageBackground
            source={require("../../assets/image/blurBg.png")}
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: "90%",
                    height: "40%",
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    position: "relative",
                    paddingHorizontal: 15,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        marginTop:25,
                        marginBottom: 10,
                        fontSize: 20,
                        textAlign: "center",
                        color: "#2D9EFB",
                        fontFamily: "Poppins_500Medium",
                    }}
                >
                    По данной категории уже добавлено 10 товаров. На данный момент больше нельзя.
                    {'\n'}Авторы приложения тестируют скорость. Чуть позже мы обязательно увеличим количество товаров по одной категории.
                </Text>

                <TouchableOpacity
                    style={{
                        marginVertical: 20,
                    }}
                    onPress={onPressOk}
                >
                    <BlueButton name="Ок" />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    </Modal>

}
