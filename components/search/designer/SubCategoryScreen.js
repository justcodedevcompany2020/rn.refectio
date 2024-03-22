import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DesignerPageNavComponent from '../../Designer/DesignerPageNav';
import {BackBtn} from '../customer/CategorySingleScreen';
import {renderSwitch} from '../customer/SubCategoryScreen';

export default function SubCategoryScreen({navigation, category}) {
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
            {category.name}
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
              return navigation.navigate('CategoryScreen', {
                category: category,
                prevRoute: prevRoute,
                parentCategoryType: category,
              });
            }}>
            <Text style={{color: 'black', fontSize: 20, marginBottom: 10}}>
              {renderSwitch(category.id)}
            </Text>
          </TouchableOpacity>
          {category.childrens?.length ? (
            category.childrens.map((el, i) => (
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
      <DesignerPageNavComponent active_page={'Поиск'} navigation={navigation} />
    </SafeAreaView>
  );
}
