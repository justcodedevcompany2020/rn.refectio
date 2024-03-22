import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import Loading from '../../Component/Loading';
import CustomerMainPageNavComponent from '../../Customer/CustomerMainPageNav';
import Slider2 from '../../slider/Slider2';
import shuffle from '../shuffle';

export default function CategorySingleScreenCustomer({
  category,
  mynextUrl,
  myproducts,
  product,
  cityId,
  params,
  startPrice,
  endPrice,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState();
  const [nextUrl, setNextUrl] = useState(mynextUrl);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const firstPageUrl = 'https://admin.refectio.ru/public/api/photo_filter';
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    setProduct();
  }, []);

  function setProduct() {
    setProducts(myproducts);
    setLoading(false);
  }

  async function getProducts(refresh) {
    let formdata = new FormData();
    if (category.parent) {
      formdata.append('parent_category_id', category.parent_id);
      formdata.append('category_id', category.id);
    } else {
      formdata.append('parent_category_id', category.id);
    }

    cityId && formdata.append('city_id', cityId.id);
    startPrice &&
      formdata.append('start_price', startPrice.replaceAll('.', ''));
    endPrice && formdata.append('end_price', endPrice.replaceAll('.', ''));

    await fetch(refresh ? firstPageUrl : nextUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(res => {
        let arr = shuffle(res.data.data);
        refresh ? setProducts(arr) : setProducts([...products, ...arr]);
        setNextUrl(res.data.next_page_url);
        setIsRefreshing(false);
        setLoading(false);
        setMoreLoading(false);
      });
  }

  const handleLoadMore = () => {
    if (nextUrl && !moreLoading) {
      setMoreLoading(true);
      getProducts();
    }
  };

  const renderFooter = () => {
    return (
      <View style={{marginVertical: 30}}>
        {moreLoading ? (
          <View style={{marginBottom: 30}}>
            <Loading />
          </View>
        ) : null}
      </View>
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    getProducts('refresh');
  };

  const handleScrollToIndex = useCallback(
    product => {
      setProducts([
        params.clickedItem,
        ...myproducts.filter((_, i) => i !== product),
      ]);
    },
    [product],
  );
  useEffect(() => {
    handleScrollToIndex(product);
  }, [product]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          position: 'relative',
        }}>
        <BackBtn onPressBack={() => navigation.goBack()} />
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            ref={flatListRef}
            onScrollToIndexFailed={info => {
              handleScrollToIndex(info.index);
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index}
            data={products}
            renderItem={({item, _}) => {
              return (
                <View
                  style={{
                    marginTop: 15,
                  }}>
                  <Slider2 slid={item.product_image} />
                  <TouchableOpacity
                    style={{flexDirection: 'row', marginTop: 10}}
                    onPress={() => {
                      const routes = navigation.getState()?.routes;
                      const prevRoute = routes[routes.length - 2];
                      navigation.navigate('CustomerPageTwoDuble', {
                        id: item.user_product.id,
                        fromSearch: true,
                        prevRoute,
                      });
                    }}>
                    <Image
                      source={{
                        uri:
                          `https://admin.refectio.ru/storage/app/uploads/` +
                          item.user_product.logo,
                      }}
                      style={{
                        width: 50,
                        height: 50,
                        marginRight: 12,
                        borderRadius: 15,
                      }}
                    />
                    <View
                      style={{
                        width: '90%',
                      }}>
                      <View style={styles.itemNameBox}>
                        <Text style={styles.itemName}>
                          {item.name.length > 35
                            ? item.name.substring(0, 35 - 3) + '...'
                            : item.name}
                        </Text>
                      </View>
                      {item.facades && (
                        <Text style={{width: '92%'}}>
                          Фасады : {item.facades}
                        </Text>
                      )}
                      {item.frame && (
                        <Text
                          style={{
                            width: '90%',
                          }}>
                          Корпус: {item.frame}
                        </Text>
                      )}
                      {item.profile && (
                        <Text
                          style={{
                            width: '90%',
                          }}>
                          Профиль: {item.profile}
                        </Text>
                      )}
                      {item.tabletop && (
                        <Text
                          style={{
                            width: '90%',
                          }}>
                          Столешница: {item.tabletop}
                        </Text>
                      )}
                      {item.length && (
                        <Text
                          style={{
                            width: '90%',
                          }}>
                          Длина: {item.length.replace('.', ',')} м.
                        </Text>
                      )}
                      {item.height && (
                        <Text
                          style={{
                            width: '90%',
                          }}>
                          Высота: {item.height.replace('.', ',')} м.
                        </Text>
                      )}
                      {item.material && (
                        <Text
                          style={{
                            width: '90%',
                          }}>
                          Материал: {item.material}
                        </Text>
                      )}
                      {item.price && (
                        <Text>
                          Цена:{' '}
                          {item.price
                            .toString()
                            .split('.')
                            .join('')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                          руб.
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListHeaderComponent={() => (
              <Text style={{marginTop: 20, fontSize: 20}}>{category.name}</Text>
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                colors={['#94D8F4']}
                onRefresh={handleRefresh}
              />
            }
          />
        )}
      </View>
      <CustomerMainPageNavComponent
        active_page={'Поиск'}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

export function BackBtn({onPressBack}) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginLeft: -10,
      }}
      onPress={onPressBack}>
      <Svg
        width={25}
        height={30}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M20.168 27.708a1.458 1.458 0 01-1.137-.54l-7.044-8.75a1.458 1.458 0 010-1.851l7.292-8.75a1.46 1.46 0 112.245 1.866L15.006 17.5l6.3 7.817a1.458 1.458 0 01-1.138 2.391z"
          fill="#94D8F4"
        />
      </Svg>
      <Text style={styles.backText}>Назад</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backText: {
    color: '#94D8F4',
    fontSize: 16,
    marginTop: 5,
  },
  itemNameBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 'auto',
    marginTop: 5,
    marginBottom: 4,
  },
  itemName: {
    fontFamily: 'Raleway_600SemiBold',
    fontSize: 13,
    color: '#333333',
    fontWeight: '700',
    // width:'86%'
  },
  itemType: {
    fontFamily: 'Raleway_600SemiBold',
    fontSize: 13,
    color: '#333333',
    fontWeight: '700',
  },
});
