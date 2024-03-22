import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Slider2 from '../slider/Slider2';
import DesignerPageNavComponent from './DesignerPageNav';

export default class DesignerSavedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      isLoading: false,
      isLastPage: false,
      filter: false,
      saveds: [],
      urlImage: `https://admin.refectio.ru/storage/app/uploads/`,
    };
    this.ref = React.createRef();
  }

  getMySaveds = async page => {
    const {saveds, isLastPage} = this.state;
    console.log(page, saveds, 'mysaveda');
    let myHeaders = new Headers();
    let userToken = await AsyncStorage.getItem('userToken');
    let AuthStr = 'Bearer ' + userToken;
    myHeaders.append('Authorization', AuthStr);

    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    await fetch(
      `https://admin.refectio.ru/public/api/MyFavoritUser?page=${page}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(res => {
        if (res.status === true) {
          this.setState({isLoading: false});
          let data = res.new_data.data;
          if (data?.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (
                data[i].slider_photo?.length &&
                data[i].slider_photo[i]?.user_id == data[i]?.id
              ) {
                let product_image = data[i].slider_photo;
                product_image.length > 5 ? product_image.splice(5) : null;
                data[i].images = product_image;
              } else if (
                data[i].user_product_limit1?.length < 1 &&
                data[i]?.id == data[i].user_product_limit1[0]?.user_id
              ) {
                data[i].images = [];
                continue;
              } else {
                let product_image =
                  data[i].user_product_limit1[0].product_image;
                product_image.length > 5 ? product_image.splice(5) : null;
                data[i].images = product_image;
              }
            }
            this.setState({
              saveds: [...saveds, ...data],
              isLoading: false,
            });
          } else {
            this.setState({
              isLastPage: true,
              isLoading: false,
            });
          }
        } else {
          this.setState({
            isLastPage: true,
            isLoading: false,
          });
        }
      })
      .catch(error => console.log('error', error));
    // console.log(this.state.categories)
  };
  handleLoadMore = () => {
    this.setState(
      prevState => ({
        page: prevState.page + 1,
      }),
      () => {
        this.getMySaveds(this.state.page);
      },
    );
  };

  handleClearData = async () => {
    console.log('alll');
    await this.setState({
      saveds: [],
      page: 1,
      isLoading: false,
      isLastPage: false,
    });
  };

  loadPage = async () => {
    await this.setState({page: 1, isLoading: true, saveds: []});
    this.getMySaveds(this.state.page);
  };

  componentDidMount() {
    const {navigation} = this.props;

    this.getMySaveds(this.state.page);

    this.focusListener = navigation.addListener('focus', async () => {
      await this.loadPage();
      console.log(this.state.page, 'pagesss');
    });
  }

  componentWillUnmount() {
    if (this.focusListener) {
      console.log('clean');
      this.handleClearData();
    }
  }

  renderFooter = () => {
    if (!this.state.isLoading) return null;
    return (
      <View style={{marginVertical: 10}}>
        <ActivityIndicator size={50} color={'#C2C2C2'} />
      </View>
    );
  };

  renderItem = ({item, index}) => {
    let count = item.meshok;
    return (
      item.user_product_limit1?.length !== 0 && (
        <View key={index} style={styles.campaign}>
          <TouchableOpacity
            onPress={async () => {
              await this.props.navigation.navigate(
                'DesignerPageTwoSavedComponent',
                {
                  id: item.id,
                },
              );
            }}>
            <View style={styles.infoCompanyMain}>
              <Image
                source={{
                  uri:
                    `https://admin.refectio.ru/storage/app/uploads/` +
                    item.logo,
                }}
                style={{
                  width: 70,
                  height: 70,
                  marginRight: 12,
                  borderColor: '#C8C8C8',
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              />
              <View style={styles.infoCompany}>
                <View style={{width: '70%'}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 20,
                      fontFamily: 'Raleway_700Bold',
                      fontWeight: '700',
                      color: '#333333',
                      marginBottom: 6,
                      width: '90%',
                    }}>
                    {item.company_name}
                  </Text>
                  {count !== null ? (
                    <View style={{flexDirection: 'row'}}>
                      {[...new Array(Number(count))].map((value, i) => (
                        <Image
                          key={i}
                          source={require('../../assets/image/meshok.png')}
                          style={{
                            width: 15,
                            height: 20.5,
                            marginRight: 3,
                          }}
                        />
                      ))}
                    </View>
                  ) : (
                    <View style={{width: 15, height: 20.5}}></View>
                  )}
                </View>

                <Text
                  key={index}
                  style={{
                    fontSize: 16,
                    color: '#A8A8A8',
                    paddingTop: 5,
                    fontWeight: '400',
                  }}>
                  {item.made_in}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View>
            <ScrollView
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {item.parent_category.map((item, ind) => {
                return (
                  <Text key={ind} style={styles.categoriesName}>
                    {item.parent_category_name}
                  </Text>
                );
              })}
            </ScrollView>
          </View>
          <Slider2 slid={item.images} />
        </View>
      )
    );
  };

  render() {
    // console.log(this.state.page, this.state.saveds, 'render');
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={styles.main}>
          <View style={styles.nameCompanyParent}>
            <Text style={styles.componyName}>Избранное</Text>
          </View>
          {this.state.isLoading ? (
            <ActivityIndicator
              size={'large'}
              color={'#c2c2c2'}
              style={styles.loaderBox}
            />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
              ref={this.ref}
              data={this.state.saveds}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={this.renderFooter}
            />
          )}
        </View>
        <DesignerPageNavComponent
          active_page={'Избранное'}
          navigation={this.props.navigation}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 15,
    position: 'relative',
  },
  nameCompanyParent: {
    marginTop: 12,
    paddingLeft: 2,
    marginBottom: 11,
  },
  user: {
    width: 30,
    height: 30,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  componyName: {
    fontSize: 22,
    fontFamily: 'Poppins_500Medium',
    color: '#1571F0',
  },

  campaign: {
    width: '100%',
    marginBottom: 34,
  },
  infoCompanyMain: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCompany: {
    width: '76%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoriesName: {
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    paddingHorizontal: 3,
    paddingVertical: 5,
    marginRight: 11,
    color: '#333333',
  },
  loaderBox: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});
