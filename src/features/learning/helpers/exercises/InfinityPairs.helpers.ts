import { InfinityPairItem, MissedPair } from '../../hooks/useInfinityPairs';
import { Pair } from '../../services/InfinityPairs.service';

/**
 * Calculates combo-based score points.
 * +1 base, +1 after 3 consecutive, +1 more after 5.
 */
export const calculateComboPoints = (comboCount: number): number => {
    if (comboCount > 5) return 3;
    if (comboCount > 2) return 2;
    return 1;
};

/**
 * Returns true if the combo earns a +5s time bonus (at ×5, ×10, ×15…).
 */
export const shouldGrantTimeBonus = (comboCount: number): boolean => {
    return comboCount > 0 && comboCount % 5 === 0;
};

/**
 * Returns true if the combo earns a +1 life bonus (at ×7, ×14, ×21…).
 */
export const shouldGrantLifeBonus = (comboCount: number): boolean => {
    return comboCount > 0 && comboCount % 7 === 0;
};

/**
 * Attempts to find the left+right texts from a failed match for the error summary.
 * Returns a MissedPair or null if texts can't be determined.
 */
export const extractMissedPair = (
    allItems: InfinityPairItem[],
    selectedId: string,
    pressedItemId: string,
): MissedPair | null => {
    const failedLeft = allItems.find(
        i => i.col === 'left' && (i.id === selectedId || i.id === pressedItemId),
    );
    const failedRight = allItems.find(
        i => i.col === 'right' && (i.id === selectedId || i.id === pressedItemId),
    );
    if (failedLeft && failedRight) {
        return { left: failedLeft.text, right: failedRight.text };
    }
    return null;
};

/**
 * Adds a missed pair to the list, avoiding duplicates by left text.
 */
export const addUniqueMissedPair = (
    existing: MissedPair[],
    newPair: MissedPair,
): MissedPair[] => {
    if (existing.some(p => p.left === newPair.left)) return existing;
    return [...existing, newPair];
};

interface FillGridResult {
    newLeftItems: (InfinityPairItem | null)[];
    newRightItems: (InfinityPairItem | null)[];
    remainingBuffer: Pair[];
    nextId: number;
    changed: boolean;
}

/**
 * Fills empty grid slots from the pair buffer.
 * On initial fill, all empty slots are filled with shuffled positions.
 * On subsequent fills, `fillBatchSize` slots are filled at a time.
 */
export const fillGridFromBuffer = (
    leftItems: (InfinityPairItem | null)[],
    rightItems: (InfinityPairItem | null)[],
    pairBuffer: Pair[],
    currentNextId: number,
    visibleCount: number,
    fillBatchSize: number,
): FillGridResult => {
    const bufferClone = [...pairBuffer];
    const newLeftItems = [...leftItems];
    const newRightItems = [...rightItems];
    let changed = false;
    let nextId = currentNextId;

    const leftEmptyIndices: number[] = [];
    const rightEmptyIndices: number[] = [];

    newLeftItems.forEach((item, index) => { if (item === null) leftEmptyIndices.push(index); });
    newRightItems.forEach((item, index) => { if (item === null) rightEmptyIndices.push(index); });

    const isInitialFill = leftEmptyIndices.length === visibleCount;
    const emptySpots = Math.min(leftEmptyIndices.length, rightEmptyIndices.length);

    if (isInitialFill || emptySpots >= fillBatchSize) {
        if (isInitialFill) {
            leftEmptyIndices.sort(() => Math.random() - 0.5);
            rightEmptyIndices.sort(() => Math.random() - 0.5);
        }

        const pairsToAdd = isInitialFill ? emptySpots : fillBatchSize;
        const actualAdd = Math.min(pairsToAdd, bufferClone.length);

        for (let k = 0; k < actualAdd; k++) {
            const pair = bufferClone.shift();
            if (pair) {
                const id = nextId++;
                newLeftItems[leftEmptyIndices[k]] = { id: `l-${id}`, text: pair.left, pairId: id, col: 'left' };
                newRightItems[rightEmptyIndices[k]] = { id: `r-${id}`, text: pair.right, pairId: id, col: 'right' };
                changed = true;
            }
        }
    }

    return {
        newLeftItems,
        newRightItems,
        remainingBuffer: bufferClone,
        nextId,
        changed,
    };
};
