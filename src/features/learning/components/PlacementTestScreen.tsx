import { useNavigation } from '@react-navigation/native';

import { LearningSection } from './LearningSection';

import { useRoute } from '@react-navigation/native';

export const PlacementTestScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lessonId } = route.params || {};

    return (
        <LearningSection
            lessonId={lessonId || "placement_test_basic"}
            loadingText="Cargando prueba de nivel..."
            onExit={() => navigation.navigate('Home')}
        />
    );
};