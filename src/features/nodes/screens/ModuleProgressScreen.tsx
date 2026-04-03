import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { LoadingScreen } from '../../../components';
import { useAppTheme } from '../../../theme/ThemeContext';
import { ModuleAccordion } from '../components/list/ModuleAccordion';
import { OverallProgress } from '../components/progress/OverallProgress';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { ModuleStatsCards } from '../components/progress/ModuleStatsCards';

export const ModuleProgressScreen = () => {
    const theme = useAppTheme();
    const { modules, isLoading, expandedModules, toggleModule } = useModuleProgress();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        listContent: {
            paddingBottom: 40,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        headerSubtitle: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginTop: 4,
        }
    }), [theme]);

    const renderHeader = useMemo(() => (
        <View>
            <ModuleStatsCards orientation="row" />

            {modules.length > 0 && <OverallProgress modules={modules} />}
        </View>
    ), [modules]);

    if (isLoading) {
        return <LoadingScreen type="lessons" />;
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={modules}
                extraData={expandedModules}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ModuleAccordion
                        module={item}
                        isExpanded={expandedModules.has(item.id)}
                        onToggle={toggleModule}
                    />
                )}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};
