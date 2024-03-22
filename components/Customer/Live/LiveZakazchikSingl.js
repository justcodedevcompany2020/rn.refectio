import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ArrowGrayComponent from '../../../assets/image/ArrowGray';
import CustomerMainPageNavComponent from '../CustomerMainPageNav';

export default class LiveZakazchikSinglComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      isLoading: false,
      isLastPage: false,

      name: '',
      surname: '',
      photo: '',
      designer_name: '',
      designer_surname: '',
      // refreshing: false,
    };
    // this.onRefresh = this.onRefresh.bind(this);
  }

  clearAllData = async () => {
    await this.setState({
      data: [],
      page: 1,
      isLoading: false,
      isLastPage: false,
      name: '',
      surname: '',
      photo: '',
      designer_name: '',
      designer_surname: '',
    });
  };

  loadMore = async () => {
    const {page, data, isLastPage} = this.state;
    const {item_id} = this.props;
    let token = await AsyncStorage.getItem('userToken');
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');

    let raw = JSON.stringify({
      some_id: item_id,
    });
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    if (isLastPage) {
      return;
    }
    this.setState({isLoading: true});
    fetch(
      `https://admin.refectio.ru/public/api/SinglePageOrdersFromManufacter?page=${page}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(async responseJson => {
        if (responseJson.status === true) {
          await this.setState({
            name: responseJson?.order_data?.name,
            surname: responseJson?.order_data?.surname,
            photo: responseJson?.order_data?.photo,
          });

          if (responseJson.My_Data.data.length > 0) {
            await this.setState({
              data: [...data, ...responseJson?.My_Data?.data],
              page: page + 1,
              isLoading: false,
            });
          } else {
            await this.setState({
              isLastPage: true,
              isLoading: false,
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  fetchData = async () => {
    const {page, data, isLastPage} = this.state;
    const {item_id} = this.props;
    let token = await AsyncStorage.getItem('userToken');
    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');
    await this.setState({isLoading: true, page: 1, data: []});
    let raw = JSON.stringify({
      some_id: item_id,
    });
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    // if (isLastPage) {
    //   return;
    // }
    await fetch(
      `https://admin.refectio.ru/public/api/SinglePageOrdersFromManufacter?page=${page}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(async responseJson => {
        if (responseJson.status === true) {
          await this.setState({
            name: responseJson?.order_data?.name,
            surname: responseJson?.order_data?.surname,
            photo: responseJson?.order_data?.photo,
            designer_name: responseJson?.designer?.name,
            designer_surname: responseJson?.designer?.surname,
          });

          console.log(responseJson);
          if (responseJson.My_Data.data.length > 0) {
            await this.setState({
              data: responseJson?.My_Data?.data,
              page: page + 1,
              isLoading: false,
            });
          } else {
            await this.setState({
              isLastPage: true,
              isLoading: false,
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  componentDidMount() {
    const {navigation} = this.props;
    // this.fetchData();

    this.focusListener = navigation.addListener('focus', () => {
      this.fetchData();
    });
  }

  componentWillUnmount() {
    if (this.focusListener) {
      this.focusListener;
      console.log(' END');
    }
    this.clearAllData();
  }

  renderItem = ({item, index}) => {
    let photo = item.order_photo[0];
    photo = photo.photo;

    return (
      <TouchableOpacity
        style={styles.mainUserContainer}
        onPress={async () => {
          await this.props.navigation.navigate('EditZakazi', {
            params: {order_id: item.id, item_id: this.props.item_id},
          });
          await this.clearAllData();
        }}>
        <View style={styles.mebelTypeBox}>
          <Image
            source={{
              uri: `https://admin.refectio.ru/public/uploads/` + photo,
            }}
            style={styles.imageMebel}
            resizeMode={'contain'}
          />
          <View style={styles.mebelType}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.mebelName}>{item.name}</Text>
            </View>
            <View style={styles.readyShiping}>
              <Text style={styles.readyText}>
                Готовность {'\n'}
                <Text style={styles.readyDate}>{item.gatovnost}</Text>
              </Text>

              <Text style={styles.readyText}>
                Доставка {'\n'}
                <Text style={styles.readyDate}>{item.dostavka}</Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    if (!this.state.isLoading) return null;
    return (
      <View style={{marginVertical: 10}}>
        <ActivityIndicator size={50} color={'#C2C2C2'} />
      </View>
    );
  };

  // onRefresh() {
  //   this.setState({ refreshing: true });
  //   this.clearAllData();
  //   this.fetchData();
  //   setTimeout(() => {
  //     this.setState({ refreshing: false });
  //   }, 2000);
  // }

  handleLoadMore = () => {
    const {page} = this.state;
    if (page >= 2) {
      this.loadMore();
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.NameBack}>
            <TouchableOpacity
              style={styles.goBack}
              onPress={async () => {
                await this.clearAllData();
                this.props.navigation.goBack();
              }}>
              <ArrowGrayComponent />
            </TouchableOpacity>
            <Text style={styles.userName}>
              {this.state.name} {this.state.surname}
            </Text>

            <Image
              source={{
                uri:
                  `https://admin.refectio.ru/public/uploads/UnicodeIcon/` +
                  this.state.photo,
              }}
              style={styles.userIcon}
              resizeMode={'contain'}
            />
          </View>

          <View style={{flex: 1}}>
            <View style={styles.designerNameTopParent}>
              <Text style={styles.designerNameTop}>
                {this.state.designer_name} {this.state.designer_surname}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.plusPraizvaditel}
              onPress={() => {
                this.props.navigation.navigate('AddZakazi', {
                  params: this.props.item_id,
                });
                this.clearAllData();
              }}>
              <Text style={styles.plusPraizvaditelText}>+ Товар</Text>
            </TouchableOpacity>
            {this.state.data.length == 0 &&
              !this.state.isLoading &&
              this.state.isLastPage && (
                <Text
                  style={{textAlign: 'center', fontSize: 16, marginTop: 20}}>
                  Список данных пуст
                </Text>
              )}
            <FlatList
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
              data={this.state.data}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={this.renderFooter}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={this.state.refreshing}
              //     onRefresh={this.onRefresh}
              //   />
              // }
            />
          </View>
        </View>
        <CustomerMainPageNavComponent
          active_page={'Заказы'}
          navigation={this.props.navigation}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  NameBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 18,
    justifyContent: 'space-between',
  },
  designerNameTopParent: {
    borderBottomWidth: 1,
    borderColor: '#D0D0D0',
    paddingBottom: 8,
  },
  designerNameTop: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 17,
    color: '#464849',
  },
  userName: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: '#464849',
  },
  userIcon: {
    width: 40,
    height: 40,
  },
  mainUserContainer: {
    // marginBottom: 14,
  },
  praizvaditelName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: '#060606',
    marginBottom: 8,
  },
  mebelTypeBox: {
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
    flexDirection: 'row',
  },
  imageMebel: {
    width: 84,
    height: 84,
    borderRadius: 18,
  },
  mebelType: {
    marginLeft: 15,
    justifyContent: 'space-between',
    width: '70%',
  },
  mebelName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  readyShiping: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readyText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#AEAEAE',
  },
  readyDate: {
    color: '#52A8EF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  plusPraizvaditel: {
    width: 152,
    height: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  plusPraizvaditelText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#969696',
  },
  goBack: {
    marginLeft: -10,
  },
});
