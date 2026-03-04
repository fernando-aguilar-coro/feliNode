import { useNavigation } from '@react-navigation/native';

import { LearningSection } from './LearningSection';

import { useRoute } from '@react-navigation/native';
import { useSettingsStore } from '../../../store/SettingsStore';

export const PlacementTestScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { lessonId } = route.params || {};
    const { setHasDecidedPlacementTest } = useSettingsStore();

    return (
        <LearningSection
            lessonId={lessonId || "placement_test_basic"}
            loadingText="Cargando prueba de nivel..."
            onExit={() => setHasDecidedPlacementTest(true)}
        />
    );
};