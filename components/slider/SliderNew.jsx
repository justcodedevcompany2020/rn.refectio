import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import CloseIcon from './CloseIcon';
import ListItem from './ListItem';
import CarouselBackground from './SliderBackground';

const CONTAINER_HEIGHT = 50;

const Carousel = ({route}) => {
  const {imagesData, imgActive} = route.params;
  const {width} = Dimensions.get('screen');
  const [loading, setLoading] = useState(true);
  const [sliderImages, setSliderImages] = useState(imagesData);
  const [currentOrintation, setCurrentOrintation] = useState(null);

  const windowDimensions = Dimensions.get('window');
  const screenDimensions = Dimensions.get('screen');
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  const activeIdRef = useRef('');
  const scrollViewRef = useRef();
  const ScrollX = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  let _clampedScrollValue = 0;
  let _offsetValue = 0;
  let _scrollValue = 0;

  let scrollEndTimer = null;

  const onMomentumScrollBegin = () => {
    clearTimeout(scrollEndTimer);
  };

  const onMomentumScrollEnd = () => {
    const toValue =
      _scrollValue > CONTAINER_HEIGHT &&
      _clampedScrollValue > CONTAINER_HEIGHT / 2
        ? _offsetValue + CONTAINER_HEIGHT
        : _offsetValue - CONTAINER_HEIGHT;

    Animated.timing(offsetAnim, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const onScrollEndDrag = () => {
    scrollEndTimer = setTimeout(onMomentumScrollEnd, 0);
  };

  const handleChangeViewableItem = () => {
    const {width} = Dimensions.get('screen');
    const findedIndex = sliderImages.findIndex(
      el => el.id === activeIdRef.current,
    );
    const offsetforBigScreens = findedIndex >= 0 ? findedIndex * width : 0;
    setTimeout(() => {
      scrollViewRef.current?.scrollToOffset({
        offset: offsetforBigScreens,
        animated: false,
      });
    }, 100);
  };

  const viewabilityConfigCallbackPairs = useRef([
    {
      onViewableItemsChanged: ({viewableItems}) => {
        if (viewableItems[0]) {
          activeIdRef.current = viewableItems[0].item.id;
        }
      },
    },
  ]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window: {width, height}}) => {
        if (width < height) {
          setCurrentOrintation('PORTRAIT');
        } else {
          setCurrentOrintation('LANDSCAPE');
          handleChangeViewableItem();
        }
      },
    );
    return () => subscription?.remove();
  }, [dimensions.screen]);

  useEffect(() => {
    const shiftingItem = sliderImages.find((_, i) => i === imgActive);
    if (shiftingItem) {
      let data = [...sliderImages];
      const filteredData = data.filter(el => el.id !== shiftingItem.id);
      filteredData.unshift(shiftingItem);
      setSliderImages(filteredData);
    }
  }, [imgActive]);

  useEffect(() => {
    currentOrintation === 'LANDSCAPE'
      ? Dimensions.addEventListener('change', handleChangeViewableItem)
      : null;
  }, [currentOrintation]);

  useEffect(() => {
    ScrollX.addListener(({value}) => {
      const diff = value - _scrollValue;
      _scrollValue = value;
      _clampedScrollValue = Math.min(
        Math.max(_clampedScrollValue + diff, 0),
        CONTAINER_HEIGHT,
      );
    });
    offsetAnim.addListener(({value}) => {
      _offsetValue = value;
    });
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    return () => subscription?.remove();
  }, []);

  return (
    <View
      style={{
        width,
      }}>
      <Pressable style={styles.closeBox} onPress={() => navigation.goBack()}>
        <CloseIcon />
      </Pressable>
      <View style={styles.mainContainer}>
        {loading && (
          <View style={styles.loaderBox}>
            <ActivityIndicator
              color={'#fff'}
              size={'large'}
              style={{height: '100%', width: '100%'}}
            />
          </View>
        )}
        <View
          style={{
            width,
          }}>
          <CarouselBackground
            scrollX={ScrollX}
            imagesData={sliderImages}
            setLoading={setLoading}
          />
        </View>
        <Animated.FlatList
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: ScrollX}}}],
            {useNativeDriver: true},
          )}
          style={{width: '100%'}}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          ref={scrollViewRef}
          onMomentumScrollBegin={onMomentumScrollBegin}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          scrollEventThrottle={1}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          data={sliderImages}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal
          pagingEnabled
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => <ListItem item={item} keys={index} />}
        />
      </View>
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
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
  closeBox: {
    position: 'absolute',
    zIndex: 999,
    top: 20,
    right: 20,
  },
});
