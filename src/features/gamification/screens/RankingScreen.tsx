import { useTranslation } from 'react-i18next';
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Animated as RNAnimated, TouchableOpacity } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getRanking, getUserPosition } from '../../../api/getRanking';
import { supabase } from '../../../api/supabaseClient';
import RankingItem from '../components/ranking/RankingItem';
import RankingHeader from '../components/ranking/RankingHeader';
import { Screen } from '../../../components/Screen';
import { useAppTheme } from '../../../theme/ThemeContext';
import { GenericModal } from '../../../components/GenericModal';
import { SocialLogin } from '../../auth/components/SocialLogin';
import { useUserStore } from '../../../store/UserStore';

// TODO: Implementar login modal

interface RankingData {
  xp: number;
  user_id: string;
  profiles?: {
    username: string;
  };
}

const RankingScreen: React.FC = () => {
  const [ranking, setRanking] = useState<RankingData[]>([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { loading: authLoading, isAuthenticated, isGuest } = useUserStore();

  const fetchData = async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);

      const [rankingData, position, userResponse] = await Promise.all([
        getRanking(100),
        getUserPosition(),
        supabase.auth.getUser()
      ]);

      setRanking(rankingData as any);
      setUserPosition(position);
      setCurrentUserId(userResponse.data?.user?.id || null);

    } catch (err) {
      console.error('[RankingScreen] Error fetching data:', err);
      setError(t('gamification.ranking.connectionError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isGuest) {
      fetchData();
      setShowLoginModal(false);
    }
  }, [isAuthenticated, isGuest]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const renderItem = ({ item, index }: { item: RankingData, index: number }) => (
    <RankingItem
      rank={index + 1}
      username={item.profiles?.username || t('gamification.ranking.anon')}
      xp={item.xp}
      isCurrentUser={item.user_id === currentUserId}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.surface }]}>
          <MaterialCommunityIcons
            name={error ? "wifi-off" : "account-group-outline"}
            size={48}
            color={theme.colors.primary}
          />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
          {error ? t('gamification.ranking.connectionErrorTitle') : t('gamification.ranking.emptyTitle')}
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
          {error || t('gamification.ranking.emptySubtitle')}
        </Text>
        <FAB
          icon="refresh"
          label={t('gamification.ranking.tryAgain')}
          onPress={onRefresh}
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          color="#FFF"
        />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          {t('gamification.ranking.loading')}
        </Text>
      </View>
    );
  }

  return (
    <Screen style={styles.container}>
      <FlatList
        data={ranking}
        keyExtractor={(item) => item.user_id}
        renderItem={renderItem}
        ListHeaderComponent={RankingHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
          backgroundColor: theme.colors.background
        }}
      />

      {/* Footer User Rank Summary */}
      <Animated.View
        entering={FadeInDown.delay(400)}
        style={[
          styles.footer,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            paddingBottom: insets.bottom + 16,
          }
        ]}
      >
        <View style={styles.footerContent}>
          {userPosition ? (
            <>
              <View style={[styles.footerRankBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.footerRankText}>#{userPosition}</Text>
              </View>
              <View style={styles.footerTextContainer}>
                <Text style={[styles.footerTitle, { color: theme.colors.text }]}>
                  {t('gamification.ranking.keepItUp')}
                </Text>
                <Text style={[styles.footerSubtitle, { color: theme.colors.textSecondary }]}>
                  {t('gamification.ranking.greatJob')}
                </Text>
              </View>
              <MaterialCommunityIcons name="rocket-launch" size={28} color={theme.colors.primary} />
            </>
          ) : (
            <TouchableOpacity
              style={styles.footerTouchable}
              onPress={() => setShowLoginModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.footerTextContainer}>
                <Text style={[styles.footerTitle, { color: theme.colors.text }]}>
                  {currentUserId ? t('gamification.ranking.notInRanking') : t('gamification.ranking.loginToParticipate')}
                </Text>
                <Text style={[styles.footerSubtitle, { color: theme.colors.textSecondary }]}>
                  {currentUserId
                    ? t('gamification.ranking.earnXpToSeeRank')
                    : t('gamification.ranking.createAccountToSave')}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={currentUserId ? "medal-outline" : "account-lock-outline"}
                size={28}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <GenericModal
        visible={showLoginModal}
        title={t('gamification.ranking.loginToParticipate')}
        description={t('gamification.ranking.createAccountToSave')}
        onSecondaryPress={() => setShowLoginModal(false)}
        secondaryButtonText={t('common.cancel')}
        dismissable={true}
      >
        <View style={styles.modalContent}>
          <SocialLogin
            loading={authLoading}
            onError={(msg) => console.error('[RankingScreen] Login error:', msg)}
          />
        </View>
      </GenericModal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRankBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  footerRankText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Nunito-Black',
  },
  footerTextContainer: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  footerSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Black',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  retryButton: {
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
  },
  footerTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContent: {
    paddingVertical: 10,
  }
});

export default RankingScreen;
