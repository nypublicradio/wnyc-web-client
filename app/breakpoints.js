const narrow = 321;
const middleNarrow = 476;
const middleMiddle = 701;
const medium = 801;
const large = 1025;

export default {
  largeAndUp: `(min-width: ${large}px)`,
  mediumAndUp: `(min-width: ${medium}px)`,
  smallAndUp: `(min-width: ${narrow}px)`,
  middleNarrowAndUp: `(min-width: ${middleNarrow}px)`,
  middleMiddleAndUp: `(min-width: ${middleMiddle}px)`,

  narrowOnly: `(max-width: ${narrow - 1}px)`,
  middleNarrowOnly: `(max-width: ${middleNarrow - 1}px)`,
  smallOnly: `(max-width: ${medium - 1}px)`,
  mediumOnly: `(max-width: ${large - 1}px)`
};
