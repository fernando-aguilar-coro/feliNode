import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

interface TheoryViewerProps {
    content: any[];
    onContinue: () => void;
}

export const TheoryViewer: React.FC<TheoryViewerProps> = ({ content, onContinue }) => {
    return (
        <ScrollView style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Theory</Text>

            {content.map((item, index) => {
                // Determine how to render based on item structure or type
                // For now, assuming simple objects or strings
                const text = typeof item === 'string' ? item : (item.content || JSON.stringify(item));

                return (
                    <View key={index} style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 16 }}>{text}</Text>
                    </View>
                );
            })}

            <View style={{ marginTop: 30 }}>
                <Button title="Start Exercises" onPress={onContinue} />
            </View>
        </ScrollView>
    );
};
