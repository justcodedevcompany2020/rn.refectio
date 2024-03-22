import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import checkVersion from 'react-native-store-version';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

const _goToStore = async () => {
  await Linking.openURL(
    Platform.OS === 'ios'
      ? process.env.APP_STORE_URL
      : process.env.PLAY_STORE_URL,
  );
};

const storeData = async () => {
  try {
    await AsyncStorage.setItem('appVersion', 'value');
    console.log('Data stored successfully!');
  } catch (error) {
    console.error('Error storing data:', error);
  }
};
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('app');
    if (value !== null) {
      setStore(value);
      console.log('Data retrieved successfully:', value);
      return value;
    } else {
      // Data not found for the specified key
      console.log('No data found for the key:', key);
      return null;
    }
  } catch (error) {
    // Error retrieving data
    console.error('Error retrieving data:', error);
    return null;
  }
};
export const storeVersionChecker = async navigate => {
  const [store, setStore] = useState('');
  const currentAppVersion = DeviceInfo.getVersion();
  useEffect(() => {
    getData();
  }, []);
  try {
    const check = await checkVersion({
      version: currentAppVersion, // app local version
      iosStoreURL: process.env.APP_STORE_URL,
      androidStoreURL: process.env.PLAY_STORE_URL,
      country: 'am', // default value is 'jp'
    });
    console.log('app version check result', check);
    if (check.result && store.length <= 1) {
      console.log(store, 'store')
      storeData();
      // Alert.alert(
      //   'Check new update',
      //   'You need to update the application to continue using it',
      //   [{text: 'Cancel'}, {text: 'Update now', onPress: _goToStore}],
      // );
    } else {
    }
  } catch (err) {
    console.log('Error checking app version', err);
  }
};
