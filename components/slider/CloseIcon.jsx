import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function CloseIcon({onPress, color}) {
  return (
    <Svg
      width={24}
      height={24}
      onPress={onPress}
      viewBox="0 0 24 24"
      fill={'none'}
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M1.725 21.482a2.499 2.499 0 01.083-3.533L18.742 1.79a2.499 2.499 0 113.45 3.615L5.257 21.565a2.499 2.499 0 01-3.532-.082z"
        fill={color ? color : '#fff'}
      />
      <Rect
        x={3.44992}
        width={28.4049}
        height={4.99716}
        rx={2.49858}
        transform="rotate(43.66 3.45 0)"
        fill={color ? color : '#fff'}
      />
    </Svg>
  );
}

export default CloseIcon;
