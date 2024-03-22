import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Loading from '../../Component/Loading';
import DesignerPageNavComponent from '../../Designer/DesignerPageNav';

export default function SearchScreenDesigner({navigation, category}) {
  const [categories, setCategories] = useState([]);

  async function getCategories() {
    let myHeaders = new Headers();
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    await fetch(
      `https://admin.refectio.ru/public/api/GetProductCategory`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        setCategories(result.data.city);
      });
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          position: 'relative',
        }}>
        <Text style={{fontSize: 25, color: 'black', fontWeight: '600'}}>
          Поиск
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 50}}>
          {categories.length ? (
            categories.map((el, i) => (
              <TouchableOpacity
                style={{
                  marginBottom: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                  paddingBottom: 5,
                  borderBottomWidth: 1,
                  borderColor: 'lightgray',
                }}
                key={i}
                onPress={() => {
                  const routes = navigation.getState()?.routes;
                  const prevRoute = routes[routes.length - 2]?.name;
                  el.childrens.length
                    ? navigation.navigate('SubCategoryScreen', {
                        category: el,
                        prevRoute,
                      })
                    : navigation.navigate('CategoryScreen', {
                        category: el,
                        prevRoute,
                        parentCategoryType: category,
                      });
                }}>
                <View style={{flexDirection: 'row', flexShrink: 1}}>
                  <Image
                    style={{width: 35, height: 35, marginRight: 15}}
                    source={{
                      uri: `https://admin.refectio.ru/storage/app/uploads/${el.icon}`,
                    }}
                  />
                  <Text style={{fontSize: 21, color: 'black', flexShrink: 1}}>
                    {el.name}
                  </Text>
                </View>
                {el.childrens.length ? (
                  <Image
                    source={require('../../../assets/image/right-arrow1.png')}
                    style={{width: 20, height: 20}}
                  />
                ) : null}
              </TouchableOpacity>
            ))
          ) : (
            <View style={{marginVertical: 30}}>
              <Loading />
            </View>
          )}
        </ScrollView>
      </View>
      <DesignerPageNavComponent active_page={'Поиск'} navigation={navigation} />
    </SafeAreaView>
  );
}
