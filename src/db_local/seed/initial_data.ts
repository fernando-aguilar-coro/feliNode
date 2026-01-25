import { SeedData } from './types';
import { PLACEMENT_TEST_BASIC, PLACEMENT_TEST_INTERMEDIATE, PLACEMENT_TEST_ADVANCED } from './content';

// Aggregate all units here
const MODULES: any[] = [];

export const INITIAL_DATA: SeedData = {
    modules: MODULES,
    placement_tests: [PLACEMENT_TEST_BASIC, PLACEMENT_TEST_INTERMEDIATE, PLACEMENT_TEST_ADVANCED]
};
