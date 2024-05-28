import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomerMainPageNavComponent from '../../Customer/CustomerMainPageNav';
import {BackBtn} from '../customer/CategorySingleScreen';
// import {renderSwitch} from '../customer/SubCategoryScreen';

export default function SubCategoryScreenCustomer({navigation, category}) {
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
              marginBottom: 15,
              fontSize: 23,
              color: 'black',
              fontWeight: '500',
            }}>
            {category?.name}
          </Text>
          <TouchableOpacity
            style={{
              borderBottomWidth: 1,
              borderColor: 'lightgray',
              marginBottom: 10,
            }}
            onPress={() => {
              const routes = navigation.getState()?.routes;
              const prevRoute = routes[routes.length - 2];
              navigation.navigate('CategoryScreen', {
                category: category,
                prevRoute: prevRoute,
                parentCategoryType: category,
              });
            }}>
            <Text style={{color: 'black', fontSize: 20, marginBottom: 10}}>
              {renderSwitch(category?.id)}
            </Text>
          </TouchableOpacity>
          {category?.childrens.length ? (
            category?.childrens.map((el, i) => (
              <TouchableOpacity
                style={{
                  borderBottomWidth: 1,
                  borderColor: 'lightgray',
                  marginBottom: 10,
                }}
                key={i}
                onPress={() =>
                  navigation.navigate('CategoryScreen', {
                    category: el,
                    parentCategoryType: category,
                  })
                }>
                <Text style={{color: 'black', fontSize: 20, marginBottom: 10}}>
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
      </View>
      <CustomerMainPageNavComponent
        active_page={'Поиск'}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

export function renderSwitch(id) {
  switch (id) {
    case 2:
      return 'Всё по кухням';
    case 3:
      return 'Всё по прихожим';
    case 4:
      return 'Всё по ванным комнатам';
    case 7:
      return 'Всё по гостиным';
    case 8:
      return 'Всё по детской';
    case 5:
      return 'Всё по спальням';
    case 6:
      return 'Всё по гардеробным';
    case 9:
      return 'Всё по кабинетам';
    case 18:
      return 'Всё по мягкой мебели';
    case 22:
      return 'Всё по декору';
    case 23:
      return 'Всё по изделиям из натурального камня';
    case 24:
      return 'Всё по изделиям из искусственного камня';
    case 27:
      return 'Всё по HoReCa';
    default:
      return '';
  }
}
