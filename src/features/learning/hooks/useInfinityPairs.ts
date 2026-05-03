import { useState, useEffect, useCallback, useRef } from 'react';
import { Pair, InfinityPairsService } from '../services/InfinityPairs.service';
import {
    calculateComboPoints,
    shouldGrantTimeBonus,
    shouldGrantLifeBonus,
    extractMissedPair,
    addUniqueMissedPair,
    fillGridFromBuffer,
} from '../helpers/exercises/InfinityPairs.helpers';

export interface InfinityPairItem {
    id: string;
    text: string;
    pairId: number;
    col: 'left' | 'right';
}

/** A failed attempt stores the english/spanish texts for the error summary. */
export interface MissedPair {
    left: string;
    right: string;
}

interface UseInfinityPairsProps {
    lessonId?: string;
    visibleCount?: number;
    batchSize?: number;
    fillBatchSize?: number;
    initialLives?: number;
    initialTime?: number;
}

export const useInfinityPairs = ({
    lessonId,
    visibleCount = 8,
    batchSize = 15,
    fillBatchSize = 3,
    initialLives = 7,
    initialTime = 60,
}: UseInfinityPairsProps = {}) => {
    // ── Game board state ────────────────────────────────────────────────────
    const [pairBuffer, setPairBuffer] = useState<Pair[]>([]);
    const [leftItems, setLeftItems] = useState<(InfinityPairItem | null)[]>(Array(visibleCount).fill(null));
    const [rightItems, setRightItems] = useState<(InfinityPairItem | null)[]>(Array(visibleCount).fill(null));
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
    const [errorIds, setErrorIds] = useState<[string, string] | null>(null);

    // ── Scoring & progression ───────────────────────────────────────────────
    const [score, setScore] = useState(0);
    const [roundScore, setRoundScore] = useState(0);
    const [roundGoal, setRoundGoal] = useState(batchSize);
    const [roundNum, setRoundNum] = useState(1);
    const [combo, setCombo] = useState(0);           // internal – resets at ×7 for cyclic bonuses
    const [displayCombo, setDisplayCombo] = useState(0); // visible to user – resets only on fail

    // ── Resources ───────────────────────────────────────────────────────────
    const [lives, setLives] = useState(initialLives);
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isLevelUp, setIsLevelUp] = useState(false);

    // ── Error summary ───────────────────────────────────────────────────────
    const [missedPairs, setMissedPairs] = useState<MissedPair[]>([]);

    // ── Loading ─────────────────────────────────────────────────────────────
    const [isFetching, setIsFetching] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // ── Refs / trackers ─────────────────────────────────────────────────────
    const nextPairId = useRef(0);
    const isFetchingRef = useRef(false);
    const lastFetchTime = useRef(0);
    const fetchThreshold = 5;
    /** Set by handlePress, consumed by the screen to trigger haptic once. */
    const triggerErrorHaptic = useRef(false);

    // ── Timer ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isInitialLoading || isGameOver) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isInitialLoading, isGameOver]);

    // ── Fetch pairs from AI ─────────────────────────────────────────────────
    const fetchPairs = useCallback(async (isInitial = false) => {
        if (isFetchingRef.current) return;

        const now = Date.now();
        if (!isInitial && now - lastFetchTime.current < 2000) return;

        isFetchingRef.current = true;
        setIsFetching(true);
        if (isInitial) setIsInitialLoading(true);

        const newPairs = await InfinityPairsService.fetchPairs(lessonId, batchSize, score);
        if (newPairs.length > 0) {
            setPairBuffer(prev => [...prev, ...newPairs]);
        }

        isFetchingRef.current = false;
        setIsFetching(false);
        lastFetchTime.current = Date.now();
        if (isInitial) setIsInitialLoading(false);
    }, [lessonId, batchSize]);

    // ── Initial fetch ───────────────────────────────────────────────────────
    useEffect(() => {
        fetchPairs(true);
    }, [fetchPairs]);

    // ── Round progression — brief level-up ceremony ─────────────────────────
    useEffect(() => {
        if (roundScore >= roundGoal && !isLevelUp) {
            setIsLevelUp(true);
            setTimeout(() => {
                // Clear the grid so fillGridFromBuffer treats it as initial fill & shuffles positions
                setLeftItems(Array(visibleCount).fill(null));
                setRightItems(Array(visibleCount).fill(null));
                setMatchedIds(new Set());
                setSelectedId(null);
                setRoundScore(0);
                setRoundNum(r => r + 1);
                setRoundGoal(g => g + 5);
                setTimeLeft(initialTime);
                setIsLevelUp(false);
            }, 1500);
        }
    }, [roundScore, roundGoal, initialTime, isLevelUp]);

    // ── Grid filling — uses extracted helper ────────────────────────────────
    useEffect(() => {
        if (isInitialLoading || isGameOver) return;

        const result = fillGridFromBuffer(
            leftItems, rightItems, pairBuffer,
            nextPairId.current, visibleCount, fillBatchSize,
        );

        if (result.changed) {
            nextPairId.current = result.nextId;
            setLeftItems(result.newLeftItems);
            setRightItems(result.newRightItems);
            setPairBuffer(result.remainingBuffer);
        }

        if (result.remainingBuffer.length < fetchThreshold && !isFetchingRef.current) {
            fetchPairs();
        }
    }, [pairBuffer, leftItems, rightItems, isInitialLoading, isGameOver, fetchPairs, visibleCount, fillBatchSize]);

    // ── Core interaction handler ────────────────────────────────────────────
    const handlePress = (item: InfinityPairItem) => {
        if (isGameOver) return;
        if (errorIds) return;
        if (matchedIds.has(item.id)) return;

        // First selection
        if (selectedId === null) {
            setSelectedId(item.id);
            return;
        }

        // Deselect same item
        if (selectedId === item.id) {
            setSelectedId(null);
            return;
        }

        const allItems = [...leftItems, ...rightItems].filter(Boolean) as InfinityPairItem[];
        const firstItem = allItems.find(i => i.id === selectedId);
        if (!firstItem) return;

        // Same column → just switch selection
        if (firstItem.col === item.col) {
            setSelectedId(item.id);
            return;
        }

        const leftItem = firstItem.col === 'left' ? firstItem : item;
        const rightItem = firstItem.col === 'right' ? firstItem : item;

        // Check if there's any original pair on the current board that matches these two texts
        const isMatch = allItems.some(i => i.col === 'left' && i.text === leftItem.text) &&
            allItems.some(i => i.col === 'right' && i.text === rightItem.text) &&
            allItems.some(leftSearch => 
                leftSearch.col === 'left' && leftSearch.text === leftItem.text &&
                allItems.some(rightSearch => 
                    rightSearch.col === 'right' && rightSearch.pairId === leftSearch.pairId && rightSearch.text === rightItem.text
                )
            );

        if (isMatch) {
            handleMatch(firstItem.id, item.id);
        } else {
            handleMismatch(allItems, item.id);
        }
    };

    // ── Match sub-handler ───────────────────────────────────────────────────
    const handleMatch = (id1: string, id2: string) => {
        setMatchedIds(prev => {
            const next = new Set(prev);
            next.add(id1);
            next.add(id2);
            return next;
        });
        setSelectedId(null);

        const newInternalCombo = combo + 1;
        const newDisplayCombo = displayCombo + 1;
        setDisplayCombo(newDisplayCombo);

        const points = calculateComboPoints(newInternalCombo);
        setScore(s => s + points);
        setRoundScore(s => s + points);

        if (shouldGrantTimeBonus(newInternalCombo)) {
            setTimeLeft(prev => prev + 5);
        }

        if (shouldGrantLifeBonus(newInternalCombo)) {
            setLives(prev => prev + 1);
            setCombo(0);  // reset internal cycle
        } else {
            setCombo(newInternalCombo);
        }

        setTimeout(() => {
            setLeftItems(prev => prev.map(i => i && (i.id === id1 || i.id === id2) ? null : i));
            setRightItems(prev => prev.map(i => i && (i.id === id1 || i.id === id2) ? null : i));
            setMatchedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id1);
                newSet.delete(id2);
                return newSet;
            });
        }, 400);
    };

    // ── Mismatch sub-handler ────────────────────────────────────────────────
    const handleMismatch = (allItems: InfinityPairItem[], pressedItemId: string) => {
        setCombo(0);
        setDisplayCombo(0);

        // Track missed pair for game-over summary
        const missed = extractMissedPair(allItems, selectedId!, pressedItemId);
        if (missed) {
            setMissedPairs(prev => addUniqueMissedPair(prev, missed));
        }

        triggerErrorHaptic.current = true;

        setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) setIsGameOver(true);
            return newLives;
        });

        setErrorIds([selectedId!, pressedItemId]);
        setTimeout(() => {
            setErrorIds(null);
            setSelectedId(null);
        }, 800);
    };

    // ── Restart ─────────────────────────────────────────────────────────────
    // ── Restart ─────────────────────────────────────────────────────────────
    const restartGame = useCallback(() => {
        InfinityPairsService.resetUsedPairs();
        setPairBuffer([]);
        setLeftItems(Array(visibleCount).fill(null));
        setRightItems(Array(visibleCount).fill(null));
        setScore(0);
        setRoundScore(0);
        setRoundNum(1);
        setRoundGoal(batchSize);
        setLives(initialLives);
        setTimeLeft(initialTime);
        setIsGameOver(false);
        setIsLevelUp(false);
        setIsInitialLoading(true);
        setSelectedId(null);
        setErrorIds(null);
        setCombo(0);
        setDisplayCombo(0);
        setMissedPairs([]);
        setMatchedIds(new Set());
        fetchPairs(true);
    }, [visibleCount, batchSize, initialLives, initialTime, fetchPairs]);

    // ── Revive ─────────────────────────────────────────────────────────────
    const reviveGame = useCallback(() => {
        setLives(1);
        setTimeLeft(prev => Math.max(prev, 30)); // Give at least 30 seconds
        setIsGameOver(false);
        setCombo(0);
        setDisplayCombo(0);
    }, []);

    return {
        leftItems,
        rightItems,
        matchedIds,
        selectedId,
        errorIds,
        score,
        lives,
        timeLeft,
        roundNum,
        roundGoal,
        roundScore,
        isGameOver,
        isLevelUp,
        isInitialLoading,
        combo: displayCombo,
        missedPairs,
        triggerErrorHaptic,
        handlePress,
        restartGame,
        reviveGame,
    };
};
