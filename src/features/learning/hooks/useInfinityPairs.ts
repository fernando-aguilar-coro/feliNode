import { useState, useEffect, useCallback, useRef } from 'react';
import { Pair, InfinityPairsService } from '../services/InfinityPairs.service';

export interface InfinityPairItem {
    id: string;
    text: string;
    pairId: number;
    col: 'left' | 'right';
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
    batchSize = 25,
    fillBatchSize = 3,
    initialLives = 7,
    initialTime = 60,
}: UseInfinityPairsProps = {}) => {
    // Game State
    const [pairBuffer, setPairBuffer] = useState<Pair[]>([]);
    const [leftItems, setLeftItems] = useState<(InfinityPairItem | null)[]>(Array(visibleCount).fill(null));
    const [rightItems, setRightItems] = useState<(InfinityPairItem | null)[]>(Array(visibleCount).fill(null));
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
    const [errorIds, setErrorIds] = useState<[string, string] | null>(null);

    // Meta State
    const [score, setScore] = useState(0);
    const [roundScore, setRoundScore] = useState(0);
    const [roundGoal, setRoundGoal] = useState(batchSize);
    const [roundNum, setRoundNum] = useState(1);

    const [lives, setLives] = useState(initialLives);
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isGameOver, setIsGameOver] = useState(false);

    // Loading State
    const [isFetching, setIsFetching] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Trackers
    const nextPairId = useRef(0);
    const isFetchingRef = useRef(false);
    const lastFetchTime = useRef(0);
    const fetchThreshold = 5;

    // Timer logic
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

    const fetchPairs = useCallback(async (isInitial = false) => {
        if (isFetchingRef.current) return;

        const now = Date.now();
        if (!isInitial && now - lastFetchTime.current < 2000) return;

        isFetchingRef.current = true;
        setIsFetching(true);
        if (isInitial) setIsInitialLoading(true);

        const newPairs = await InfinityPairsService.fetchPairs(lessonId, batchSize);

        if (newPairs.length > 0) {
            setPairBuffer(prev => [...prev, ...newPairs]);
        }

        isFetchingRef.current = false;
        setIsFetching(false);
        lastFetchTime.current = Date.now();
        if (isInitial) setIsInitialLoading(false);
    }, [lessonId, batchSize]);

    // Initial Fetch
    useEffect(() => {
        fetchPairs(true);
    }, [fetchPairs]);

    // Handle Round progression
    useEffect(() => {
        if (roundScore >= roundGoal) {
            // Level Up
            setRoundScore(0);
            setRoundNum(r => r + 1);
            setRoundGoal(g => g + 5);
            setTimeLeft(initialTime);
        }
    }, [roundScore, roundGoal, initialTime]);

    // Grid filling logic
    useEffect(() => {
        if (isInitialLoading || isGameOver) return;

        let bufferClone = [...pairBuffer];
        let changed = false;

        const newLeftItems = [...leftItems];
        const newRightItems = [...rightItems];

        let leftEmptyIndices: number[] = [];
        let rightEmptyIndices: number[] = [];

        newLeftItems.forEach((item, index) => { if (item === null) leftEmptyIndices.push(index); });
        newRightItems.forEach((item, index) => { if (item === null) rightEmptyIndices.push(index); });

        const isInitialFill = leftEmptyIndices.length === visibleCount;

        // Check if we have enough empty slots to fill (must fill 3 at a time, unless initial fill)
        const emptySpots = Math.min(leftEmptyIndices.length, rightEmptyIndices.length);

        if (isInitialFill || emptySpots >= fillBatchSize) {
            if (isInitialFill) {
                leftEmptyIndices.sort(() => Math.random() - 0.5);
                rightEmptyIndices.sort(() => Math.random() - 0.5);
            }

            // Fill either the whole board or `fillBatchSize` spots
            const pairsToAdd = isInitialFill ? emptySpots : fillBatchSize;
            const actualAdd = Math.min(pairsToAdd, bufferClone.length);

            for (let k = 0; k < actualAdd; k++) {
                const pair = bufferClone.shift();
                if (pair) {
                    const id = nextPairId.current++;
                    const lIndex = leftEmptyIndices[k];
                    const rIndex = rightEmptyIndices[k];

                    newLeftItems[lIndex] = { id: `l-${id}`, text: pair.left, pairId: id, col: 'left' };
                    newRightItems[rIndex] = { id: `r-${id}`, text: pair.right, pairId: id, col: 'right' };
                    changed = true;
                }
            }
        }

        if (changed) {
            setLeftItems(newLeftItems);
            setRightItems(newRightItems);
            setPairBuffer(bufferClone);
        }

        if (bufferClone.length < fetchThreshold && !isFetchingRef.current) {
            fetchPairs();
        }

    }, [pairBuffer, leftItems, rightItems, isInitialLoading, isGameOver, fetchPairs, visibleCount, fillBatchSize]);

    const handlePress = (item: InfinityPairItem) => {
        if (isGameOver) return;
        if (errorIds) return;
        if (matchedIds.has(item.pairId)) return;

        if (selectedId === null) {
            setSelectedId(item.id);
        } else if (selectedId === item.id) {
            setSelectedId(null);
        } else {
            const allItems = [...leftItems, ...rightItems].filter(Boolean) as InfinityPairItem[];
            const firstItem = allItems.find(i => i.id === selectedId);

            if (!firstItem) return;

            if (firstItem.col === item.col) {
                setSelectedId(item.id);
                return;
            }

            if (firstItem.pairId === item.pairId) {
                // MATCH
                setMatchedIds(prev => new Set(prev).add(item.pairId));
                setSelectedId(null);
                setScore(s => s + 1);
                setRoundScore(s => s + 1);

                setTimeout(() => {
                    setLeftItems(prev => prev.map(i => i?.pairId === item.pairId ? null : i));
                    setRightItems(prev => prev.map(i => i?.pairId === item.pairId ? null : i));
                    setMatchedIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(item.pairId);
                        return newSet;
                    });
                }, 400);

            } else {
                // FAILURE
                setLives(prev => {
                    const newLives = prev - 1;
                    if (newLives <= 0) {
                        setIsGameOver(true);
                    }
                    return newLives;
                });
                setErrorIds([selectedId, item.id]);
                setTimeout(() => {
                    setErrorIds(null);
                    setSelectedId(null);
                }, 800);
            }
        }
    };

    const restartGame = useCallback(() => {
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
        setIsInitialLoading(true);
        setSelectedId(null);
        setErrorIds(null);
        setMatchedIds(new Set());
        fetchPairs(true);
    }, [visibleCount, batchSize, initialLives, initialTime, fetchPairs]);

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
        isInitialLoading,
        handlePress,
        restartGame
    };
};
