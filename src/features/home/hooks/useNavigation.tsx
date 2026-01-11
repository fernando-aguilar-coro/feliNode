import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeNavigation';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const useHomeNavigation = () => {
    return useNavigation<HomeNavigationProp>();
};
