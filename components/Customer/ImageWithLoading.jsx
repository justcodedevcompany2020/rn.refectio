import React, {useState, useEffect} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';

const ImageWithLoadingIndicator = ({source, onDelete, index}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 10, 100));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [progress]);

  const handleLoadEnd = () => {
    setLoading(false);
    setProgress(100);
  };

  return (
    <View
      style={{
        marginRight: 10,
        position: 'relative',
        width: 100,
        height: 100,
      }}>
      <ImageBackground
        source={source}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        }}
        onLoadEnd={handleLoadEnd}>
        {loading && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </ImageBackground>

      <TouchableOpacity
        onPress={() => onDelete(index)}
        style={{
          width: 20,
          height: 20,
          position: 'absolute',
          right: 5,
          top: 5,
          backgroundColor: 'white',
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/image/ixs.png')}
          style={{width: 10, height: 10}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ImageWithLoadingIndicator;
