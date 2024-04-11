import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Path, Svg} from 'react-native-svg';

import Loading from '../../Component/Loading';

import CustomerMainPageNavComponent from '../../Customer/CustomerMainPageNav';
import shuffle from '../shuffle';

const {width} = Dimensions.get('screen');

export default function CategoryScreenCustomer(props) {
  const {category, parentCategoryType, navigation, prevRoute, route} = props;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState();
  const [nextUrl, setNextUrl] = useState(
    'https://admin.refectio.ru/public/api/photo_filter',
  );
  const firstPageUrl = 'https://admin.refectio.ru/public/api/photo_filter';
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterMode, setFilterMode] = useState(false);
  const [openCityDropDown, setOpenCityDropDown] = useState(false);
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState(null);
  const [startPrice, setStartPrice] = useState(null);
  const [endPrice, setEndPrice] = useState(null);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  async function getProducts(refresh, clear) {
    let formdata = new FormData();
    if (category.parent) {
      formdata.append('parent_category_id', category.parent_id);
      formdata.append('category_id', category.id);
    } else {
      formdata.append('parent_category_id', category.id);
    }

    !clear &&
      (cityId && formdata.append('city_id', cityId.id),
      startPrice &&
        formdata.append('start_price', startPrice.replaceAll('.', '')),
      endPrice && formdata.append('end_price', endPrice.replaceAll('.', '')));
    await fetch(refresh ? firstPageUrl : nextUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(res => {
        let newArr = shuffle(res.data.data);
        let updatedProducts;

        if (refresh) {
          updatedProducts = newArr;
        } else {
          const existingIds = new Set(products.map(product => product.id));
          newArr = newArr.filter(product => !existingIds.has(product.id));
          updatedProducts = products.concat(newArr);
        }

        setProducts(updatedProducts);

        setNextUrl(res.data.next_page_url);
        setIsRefreshing(false);
        setLoading(false);
        setMoreLoading(false);
      });
  }

  useEffect(() => {
    getProducts();
    getCityApi();
  }, []);

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

  getCityApi = async () => {
    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    await fetch(
      `https://admin.refectio.ru/public/api/getCityApi`,
      requestOptions,
    )
      .then(response => response.json())
      .then(res => {
        setCities(res.data.city);
      });
  };

  const onClear = () => {
    setCityId(null);
    setStartPrice(null);
    setEndPrice(null);
    setFilterMode(false);
    setIsRefreshing(true);
    getProducts('refresh', 'clear');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
        }}>
        <BackBtn
          onPressBack={() => {
            const routes = navigation.getState()?.routes;
            const prevRoute =
              routes[routes.length - 2].name === 'CustomerPageTwo'
                ? 'SubCategoryScreen'
                : routes[routes.length - 2].name;
            return filterMode
              ? setFilterMode(false)
              : navigation.navigate(prevRoute, {category: parentCategoryType});
          }}
        />
        {loading ? (
          <Loading />
        ) : filterMode ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                marginTop: 15,
                fontSize: 20,
                textAlign: 'center',
                color: '#2D9EFB',
                fontFamily: 'Poppins_500Medium',
              }}>
              Фильтр
            </Text>

            <View
              style={{
                width: '100%',
                marginBottom: 30,
              }}>
              <Text
                style={[
                  {
                    fontFamily: 'Poppins_500Medium',
                    lineHeight: 23,
                    fontSize: 15,
                    marginTop: 27,
                    marginBottom: 5,
                  },
                  false ? {color: 'red'} : {color: '#5B5B5B'},
                ]}>
                Города (продажи продукции)
              </Text>
              <TouchableOpacity
                style={[
                  {
                    borderWidth: 1,
                    padding: 10,
                    width: '100%',
                    borderRadius: 5,
                    position: 'relative',
                    borderColor: '#F5F5F5',
                  },
                ]}
                onPress={() => setOpenCityDropDown(!openCityDropDown)}>
                <Text
                  style={{
                    padding: 5,
                    width: '100%',
                    borderRadius: 5,
                    color: '#5B5B5B',
                  }}>
                  {cityId ? cityId.name : ' Выберите город'}
                </Text>
                <View style={{position: 'absolute', right: 17, bottom: 18}}>
                  {!openCityDropDown && <CloseIcon />}
                  {openCityDropDown && <OpenIcon />}
                </View>
              </TouchableOpacity>
              <View
                style={
                  openCityDropDown
                    ? styles.sOpenCityDropDownActive
                    : styles.sOpenCityDropDown
                }>
                <ScrollView nestedScrollEnabled={true}>
                  {cities.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          textAlign: 'left',
                        }}
                        onPress={() => {
                          setCityId(item);
                          setOpenCityDropDown(false);
                        }}>
                        <Text
                          style={{
                            textAlign: 'left',
                            paddingVertical: 10,
                            fontFamily: 'Poppins_500Medium',
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View style={{marginBottom: 30}}>
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  lineHeight: 23,
                  fontSize: 16,
                  color: '#5B5B5B',
                  marginBottom: 20,
                }}>
                Цена
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  lineHeight: 23,
                  fontSize: 14,
                  color: '#5B5B5B',
                  marginBottom: 5,
                }}>
                От
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="1.000.000"
                  keyboardType="number-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '89%',
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                  value={startPrice}
                  maxLength={9}
                  onChangeText={text => {
                    let without_dots = text.split('.').join('');
                    let with_dots = without_dots
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    setStartPrice(with_dots);
                  }}
                />
                <Image
                  source={require('../../../assets/image/apranqiGin.png')}
                  style={{width: 30, height: 50}}
                />
              </View>

              <Text
                style={{
                  fontFamily: 'Poppins_500Medium',
                  lineHeight: 23,
                  fontSize: 14,
                  color: '#5B5B5B',
                  marginTop: 15,
                  marginBottom: 5,
                }}>
                До
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="1.000.000"
                  keyboardType="number-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: '#F5F5F5',
                    padding: 10,
                    width: '89%',
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                  value={endPrice}
                  maxLength={9}
                  onChangeText={text => {
                    let without_dots = text.split('.').join('');
                    let with_dots = without_dots
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    setEndPrice(with_dots);
                  }}
                />
                <Image
                  source={require('../../../assets/image/apranqiGin.png')}
                  style={{width: 30, height: 50}}
                />
              </View>
            </View>

            <View
              style={{
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  width: 165,
                  height: 38,
                  backgroundColor: '#B5D8FE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 15,
                }}
                onPress={() => {
                  setFilterMode(false);
                  handleRefresh();
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}>
                  Применить
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 165,
                  height: 38,
                  marginTop: 20,
                  backgroundColor: '#B5D8FE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 15,
                  marginBottom: 50,
                }}
                onPress={() => {
                  setCityId(null);
                  onClear();
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#FFFFFF',
                    fontWeight: '600',
                  }}>
                  Сбросить
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item.id}
            data={products}
            maxToRenderPerBatch={60}
            // initialNumToRender={1}
            // snapToInterval={9}
            renderToHardwareTextureAndroid={true}
            numColumns={3}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CategorySingleScreen', {
                      category,
                      nextUrl,
                      products,
                      product: item.id,
                      clickedItem: item,
                      cityId,
                      startPrice,
                      endPrice,
                    })
                  }>
                  <FastImage
                    style={{
                      width: (width - 40) / 3,
                      height: (width - 40) / 3,
                      marginBottom: 5,
                      marginRight: 5,
                    }}
                    source={{
                      uri:
                        `https://admin.refectio.ru/storage/app/uploads/` +
                        item.product_image[0]?.image,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
              );
            }}
            ListHeaderComponent={() => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{marginVertical: 20, fontSize: 20}}>
                    {category.name}
                  </Text>
                  <FilterIcon onPress={() => setFilterMode(true)} />
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <Text style={{textAlign: 'center', fontSize: 18}}>
                Ничего не найдено
              </Text>
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
      {!isKeyboardVisible && (
        <CustomerMainPageNavComponent
          active_page={'Поиск'}
          navigation={navigation}
        />
      )}
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
        alignSelf: 'flex-start',
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

export function FilterIcon({onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg
        width="23"
        height="19"
        viewBox="0 0 23 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M22.4375 3.25H19.2344C18.8438 1.45312 17.2812 0.125 15.4062 0.125C13.5312 0.125 11.9688 1.45312 11.5781 3.25H0.5625V4.8125H11.5781C11.9688 6.60938 13.5312 7.9375 15.4062 7.9375C17.2812 7.9375 18.8438 6.60938 19.2344 4.8125H22.4375V3.25ZM15.4062 6.375C14.0781 6.375 13.0625 5.35938 13.0625 4.03125C13.0625 2.70312 14.0781 1.6875 15.4062 1.6875C16.7344 1.6875 17.75 2.70312 17.75 4.03125C17.75 5.35938 16.7344 6.375 15.4062 6.375ZM0.5625 15.75H3.76562C4.15625 17.5469 5.71875 18.875 7.59375 18.875C9.46875 18.875 11.0312 17.5469 11.4219 15.75H22.4375V14.1875H11.4219C11.0312 12.3906 9.46875 11.0625 7.59375 11.0625C5.71875 11.0625 4.15625 12.3906 3.76562 14.1875H0.5625V15.75ZM7.59375 12.625C8.92188 12.625 9.9375 13.6406 9.9375 14.9688C9.9375 16.2969 8.92188 17.3125 7.59375 17.3125C6.26562 17.3125 5.25 16.2969 5.25 14.9688C5.25 13.6406 6.26562 12.625 7.59375 12.625Z"
          fill="black"
        />
      </Svg>
    </TouchableOpacity>
  );
}

export function OpenIcon() {
  return (
    <Svg
      width="18"
      height="10"
      viewBox="0 0 18 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1 9L9 1L17 9"
        stroke="#888888"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export function CloseIcon() {
  return (
    <Svg
      width="18"
      height="10"
      viewBox="0 0 18 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1 1L9 9L17 1"
        stroke="#888888"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  backText: {
    color: '#94D8F4',
    fontSize: 16,
    marginTop: 5,
  },
  sOpenCityDropDown: {
    width: '100%',
    height: 0,
    zIndex: 100,
  },
  sOpenCityDropDownActive: {
    width: '100%',
    height: 120,
    elevation: 2,
    borderColor: '#F5F5F5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 100,
    backgroundColor: '#fff',
  },
});
