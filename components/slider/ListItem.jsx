import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import Pinchable from 'react-native-pinchable';

const ListItem = React.memo(({item}) => {
  const {width, height} = Dimensions.get('screen');
  const [loading, setLoading] = useState(true);
  const [currentOrintation, setCurrentOrintation] = useState('PORTRAIT');
  console.log(item, 'item');
  useEffect(() => {
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        setCurrentOrintation('PORTRAIT');
      } else {
        setCurrentOrintation('LANDSCAPE');
      }
    });
  }, [height, width]);

  return (
    <View>
      {loading && (
        <View style={styles.loaderBox}>
          <ActivityIndicator
            color={'#fff'}
            size={'large'}
            style={{height: '100%', width: '100%'}}
          />
        </View>
      )}
      <Pinchable>
        <Animated.View style={[styles.listItemContainer]}>
          <Animated.View
            style={
              currentOrintation === 'LANDSCAPE'
                ? styles.listItemLandspace
                : styles.imageContainer
            }>
            <Animated.Image
              style={
                currentOrintation !== 'LANDSCAPE'
                  ? [styles.image, {minHeight: height * 0.7, width}]
                  : [
                      styles.landscapeImage,
                      {
                        minHeight: height * 0.7,
                        height,
                        minWidth: width * 0.1,
                        width,
                      },
                    ]
              }
              onPartialLoad={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              source={{
                uri: `https://admin.refectio.ru/storage/app/uploads/${item.image}`,
              }}
            />
          </Animated.View>
        </Animated.View>
      </Pinchable>
    </View>
  );
});

export default ListItem;

const styles = StyleSheet.create({
  listItemContainer: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
    height: '100%',
  },
  listItemLandspace: {
    // resizeMode: 'center',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    // paddingRight:150
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    width: '100%',
    // marginRight: 50,
  },
  landscapeImage: {
    resizeMode: 'contain',
    height: '100%',
    left: -40,
  },
  landscapeImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'red',
  },
  loaderBox: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
