import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, Alert, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { lessonRepository } from '../../../db_local/repositories';

interface RecommendTopicButtonProps {
    onTopicReceived: (topic: string) => void;
}

export const RecommendTopicButton: React.FC<RecommendTopicButtonProps> = ({ onTopicReceived }) => {
    const theme = useAppTheme();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [currentLessonTitle, setCurrentLessonTitle] = useState<string>('');

    useEffect(() => {
        const fetchContext = async () => {
            try {
                const nodes = await lessonRepository.getLessonNodes();
                const completedNodes = nodes.filter(n => n.status === 'completed');

                if (completedNodes.length > 0) {
                    completedNodes.sort((a, b) => b.order_index - a.order_index);
                    setCurrentLessonTitle(completedNodes[0].title);
                }
            } catch (error) {
                console.error("Error fetching context for RecommendTopicButton:", error);
            }
        };
        fetchContext();
    }, []);

    const SUGGESTED_TOPICS = [
        "Daily Routine & Activities",
        "Business Meetings & Emails",
        "Travel, Airport & Vacations",
        "Ordering Food at a Restaurant",
        "Essential Phrasal Verbs",
        "Common Job Interview Questions",
        "Expressing Opinions & Debating",
        "Technology, AI & The Future",
        "Health, Fitness & Wellness",
        "Socializing & Meeting Friends",
        "Shopping, Clothes & Fashion",
        "Storytelling in the Past Tense",
        "Conditional Sentences (If only...)",
        "Advanced Grammar Review",
        "Hobbies, Sports & Leisure",
        "Common Idioms & Expressions",
        "Describing People & Personality",
        "Environment & Sustainability",
        "Movies, Music & Entertainment",
        "At the Doctor's Appointment",
        "Booking a Hotel Room",
        "Giving & Following Directions",
        "At the Pharmacy or Hospital",
        "Cooking, Recipes & Ingredients",
        "Public Transport & Commuting",
        "Banking, Finance & Money",
        "Weather & Natural Phenomena",
        "Education, School & University",
        "Workplace Culture & Etiquette",
        "Art, Creativity & Museums",
        "History, Traditions & Culture",
        "Science & Space Exploration",
        "Law, Rights & Responsibilities",
        "Future Plans & Ambitions",
        "Making Complaints & Solving Issues",
        "Sports, Games & Competitions",
        "Family Relationships & Genealogy",
        "Nature, Wildlife & Outdoors",
        "Media, News & Journalism",
        "Philosophy & Life Lessons"
    ];

    const handlePress = async () => {
        setLoading(true);
        try {
            // Artificial delay to feel more "premium/AI"
            await new Promise(resolve => setTimeout(resolve, 600));

            // Simplified: pick a random item from suggested or the current lesson
            const pool = [...SUGGESTED_TOPICS];
            if (currentLessonTitle) pool.push(currentLessonTitle.trim());

            const recommended = pool[Math.floor(Math.random() * pool.length)];
            onTopicReceived(recommended);
        } catch (error) {
            console.error(error);
            Alert.alert(t('learning.pronunciation.error'), t('learning.exercises.errorRecommend'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={loading}
            style={[styles.button, { backgroundColor: theme.colors.secondary }, loading && styles.disabled]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={theme.colors.white || '#FFFFFF'} />
            ) : (
                <View style={styles.content}>
                    <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={theme.colors.white || '#FFFFFF'} style={styles.icon} />
                    <AppText variant="md" color={theme.colors.white || '#FFFFFF'} weight="bold">
                        {t('learning.exercises.suggestTopic')}
                    </AppText>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 12,
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.6,
    },
    icon: {
        marginRight: 8,
    }
});
