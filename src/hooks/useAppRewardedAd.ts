import { useEffect, useState, useCallback, useRef } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';
import { useCurrencyStore } from '../store/CurrencyStore';

export const REWARDED_AD_UNIT_ID = 'ca-app-pub-4304821010375937/8765401166';
export const useAppRewardedAd = () => {
    const inventory = useCurrencyStore((state) => state.currencies.inventory);
    const removeAds = inventory?.remove_ads === true;

    const [isLoaded, setIsLoaded] = useState(false);
    const rewardedAdRef = useRef<RewardedAd | null>(null);

    const loadAd = useCallback(() => {
        if (removeAds) return; // Don't load if premium

        const rewarded = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
            requestNonPersonalizedAdsOnly: true,
        });

        rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setIsLoaded(true);
        });

        rewarded.load();
        rewardedAdRef.current = rewarded;
    }, [removeAds]);

    useEffect(() => {
        loadAd();

        return () => {
            if (rewardedAdRef.current) {
                // Cannot easily unsubscribe all without the specific return functions,
                // but re-creating is fine on unmount.
                rewardedAdRef.current = null;
            }
        };
    }, [loadAd]);

    const showAd = useCallback((): Promise<boolean> => {
        return new Promise((resolve) => {
            if (removeAds) {
                resolve(true); // Premium users get reward instantly
                return;
            }

            const ad = rewardedAdRef.current;
            if (!ad || !isLoaded) {
                resolve(false);
                return;
            }

            let earnedReward = false;

            const unsubscribeEarned = ad.addAdEventListener(
                RewardedAdEventType.EARNED_REWARD,
                () => {
                    earnedReward = true;
                }
            );

            // In RN Google Mobile Ads v14+, the event is AdEventType.CLOSED, but on RewardedAd it might be different.
            // Let's use the hardcoded string 'closed' or if possible the enum. We can listen to closed.
            const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
                unsubscribeEarned();
                unsubscribeClosed();
                setIsLoaded(false);
                loadAd(); // Preload next ad
                resolve(earnedReward);
            });

            ad.show();
        });
    }, [isLoaded, loadAd, removeAds]);

    return {
        isLoaded,
        showAd,
    };
};
