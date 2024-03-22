import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native';
import {SafeAreaView} from 'react-native';
import {BackBtn} from '../search/customer/CategorySingleScreen';
import CustomerMainPageNavComponent from './CustomerMainPageNav';
import Loading from '../Component/Loading';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LimitPopup from './LimitPopup';

export default function SelectSubCategoryScreen({
  navigation,
  category,
  user_id,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function onPressCategory(el) {
    setIsLoading(true);
    let token = await AsyncStorage.getItem('userToken');
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    let formdata = new FormData();
    formdata.append('category_id', el.id);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: formdata,
    };

    await fetch(
      `https://admin.refectio.ru/public/api/validation_category`,
      requestOptions,
    )
      .then(response => response.json())
      .then(res => {
        console.log(res);
        setIsLoading(false);
        if (res.status) {
          navigation.navigate('AddProduct', {category: el, user_id: user_id});
        } else {
          setShowModal(true);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          position: 'relative',
        }}>
        <BackBtn onPressBack={() => navigation.goBack()} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 15}}>
          <Text
            style={{
              marginBottom: 20,
              fontSize: 23,
              color: 'black',
              fontWeight: '500',
            }}>
            {category.name}
          </Text>
          {category.childrens.length ? (
            category.childrens.map((el, i) => (
              <TouchableOpacity
                style={{
                  borderBottomWidth: 1,
                  borderColor: 'lightgray',
                  marginBottom: 10,
                }}
                key={i}
                onPress={() => onPressCategory(el)}>
                <Text style={{color: 'black', fontSize: 20, marginBottom: 15}}>
                  {el.name}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{marginTop: 30}}>
              <Text>Ничего не найдено</Text>
            </View>
          )}
        </ScrollView>
        {isLoading && <Loading />}
        <LimitPopup
          modalVisible={showModal}
          onPressOk={() => setShowModal(false)}
        />
      </View>
      <CustomerMainPageNavComponent
        active_page={'Профиль'}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}
