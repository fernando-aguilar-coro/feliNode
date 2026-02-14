
import React from 'react';
import { WordBubble } from './WordBubble';

interface DraggableWordProps {
    word: string;
    index: number;
    onDrop?: (index: number, dropX: number, dropY: number) => void;
    onPress?: () => void;
    dropZoneRef: any;
    theme: any;
    disabled?: boolean;
}

/**
 * @deprecated Use WordBubble or WordBank instead. 
 * This component has been simplified and no longer supports drag and drop animations.
 */
export const DraggableWord = ({
    word,
    onPress,
    theme,
    disabled = false
}: DraggableWordProps) => {
    return (
        <WordBubble
            word={word}
            onPress={onPress}
            theme={theme}
            isSelected={disabled}
        />
    );
};
