import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/ThemeContext';

interface RankingItemProps {
  rank: number;
  username: string;
  xp: number;
  isCurrentUser?: boolean;
}

const RankingItem: React.FC<RankingItemProps> = ({ rank, username, xp, isCurrentUser }) => {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const getRankIndicator = () => {
    if (rank === 1) return <MaterialCommunityIcons name="trophy" size={22} color="#FFD700" />;
    if (rank === 2) return <MaterialCommunityIcons name="trophy" size={22} color="#C0C0C0" />;
    if (rank === 3) return <MaterialCommunityIcons name="trophy" size={22} color="#CD7F32" />;
    return <Text style={[styles.rankText, { color: theme.colors.textSecondary }]}>{rank}</Text>;
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isCurrentUser ? theme.colors.surface : theme.colors.background,
        borderColor: isCurrentUser ? theme.colors.primary : theme.colors.border,
      }
    ]}>
      <View style={styles.rankContainer}>
        {getRankIndicator()}
      </View>

      <Avatar.Text 
        size={44} 
        label={username?.substring(0, 2).toUpperCase() || '??'} 
        style={[styles.avatar, { backgroundColor: theme.colors.surface }]}
        labelStyle={{ color: theme.colors.primary, fontFamily: 'Nunito-Bold' }}
      />

      <View style={styles.infoContainer}>
        <Text numberOfLines={1} style={[styles.username, { color: theme.colors.text }]}>
          {username || t('gamification.ranking.anon')}
        </Text>
      </View>

      <View style={styles.xpBox}>
        <Text style={[styles.xpText, { color: theme.colors.primary }]}>
          {xp.toLocaleString()} <Text style={styles.xpLabel}>{t('gamification.ranking.xp')}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  avatar: {
    marginHorizontal: 12,
  },
  infoContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  xpBox: {
    alignItems: 'flex-end',
  },
  xpText: {
    fontSize: 15,
    fontFamily: 'Nunito-Black',
  },
  xpLabel: {
    fontSize: 11,
    fontFamily: 'Nunito-Bold',
  }
});

export default RankingItem;
