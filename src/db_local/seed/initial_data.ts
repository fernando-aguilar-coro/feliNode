import { SeedData } from './types';
import { UNIT_1_MODALS } from './content/units/unit_1_modals';
import { PLACEMENT_TEST } from './content/placement_test';

// Aggregate all units here
const MODULES = [
    UNIT_1_MODALS
];

export const INITIAL_DATA: SeedData = {
    modules: MODULES,
    placement_test: PLACEMENT_TEST
};
