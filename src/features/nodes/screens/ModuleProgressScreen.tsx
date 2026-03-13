import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { useAppTheme } from '../../../theme/ThemeContext';
import { ModuleAccordion } from '../components/list/ModuleAccordion';
import { OverallProgress } from '../components/progress/OverallProgress';
import { useModuleProgress } from '../hooks/useModuleProgress';

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
        headerContainer: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 10,
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

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const renderHeader = () => (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Ruta de Aprendizaje</Text>
                <Text style={styles.headerSubtitle}>Continúa donde te quedaste</Text>
            </View>
            {modules.length > 0 && <OverallProgress modules={modules} />}
            <View style={{ height: 16 }} />
        </View>
    );

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
