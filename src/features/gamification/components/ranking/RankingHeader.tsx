import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../../theme/ThemeContext';

const RankingHeader: React.FC = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.colors.background }]}>
      <View style={styles.titleSection}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
          <MaterialCommunityIcons name="trophy" size={36} color="#FFBA08" />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('gamification.ranking.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('gamification.ranking.subtitle')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 24,
    width: '100%',
  },
  titleSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Black',
    lineHeight: 34,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default RankingHeader;
