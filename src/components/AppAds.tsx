import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  BannerAd,
  BannerAdProps,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

// ------------------------------------------------------------
// Ad Type definitions
// ------------------------------------------------------------

export type AdType = 'banner' | 'interstitial' | 'rewarded' | 'app_open' | 'native';

/** Map each ad type to its production unit ID */
const AD_UNIT_IDS: Record<AdType, string> = {
  banner: 'ca-app-pub-4304821010375937/1912250687',
  interstitial: TestIds.INTERSTITIAL,
  rewarded: TestIds.REWARDED,
  app_open: TestIds.APP_OPEN,
  native: TestIds.NATIVE,
};

// ------------------------------------------------------------
// Props: explicitly OMIT unitId so passing it causes a TS error
// ------------------------------------------------------------

type BannerExtras = Omit<BannerAdProps, 'unitId' | 'size'>;

interface AppAddProps extends BannerExtras {
  /** The ad type to render. Determines the unitId internally. */
  type: AdType;
  /** Optional BannerAdSize override (only applies to banner type). */
  size?: BannerAdSize | string;
  /** Optional container style */
  containerStyle?: ViewStyle;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

/**
 * AppAdd
 *
 * Reusable Google Mobile Ads wrapper.
 * Pass `type` to select which ad unit to render.
 * The `unitId` is resolved internally — passing it causes a TypeScript error.
 *
 * @example
 *   <AppAdd type="banner" size={BannerAdSize.LARGE_BANNER} />
 */
export const AppAds: React.FC<AppAddProps> = ({
  type,
  size = BannerAdSize.LARGE_BANNER,
  containerStyle,
  ...bannerProps
}) => {
  const unitId = AD_UNIT_IDS[type];

  return (
    <View style={[styles.container, containerStyle]} testID="app-ad-container">

      {/* ── Banner ── */}
      {type === 'banner' && (
        <BannerAd
          unitId={unitId}
          size={size}
          {...bannerProps}
        />
      )}

      {type === 'interstitial' && (
        <View testID="app-ad-interstitial-placeholder" />
      )}
      {type === 'rewarded' && (
        <View testID="app-ad-rewarded-placeholder" />
      )}

    </View>
  );
};

// ------------------------------------------------------------
// Styles
// ------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
});
