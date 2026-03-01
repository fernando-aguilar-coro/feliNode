const fs = require('fs');
const path = require('path');

const globFiles = (dir, ext) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(globFiles(fullPath, ext));
        } else {
            if (fullPath.endsWith(ext)) results.push(fullPath);
        }
    });
    return results;
};

const srcDir = path.join(__dirname, 'src');
const storeDir = path.join(__dirname, 'src', 'store'); // added
const files = [...globFiles(srcDir, '.ts'), ...globFiles(srcDir, '.tsx'), ...globFiles(__dirname, '.tsx')]; // include app.tsx

const mappings = {
    getModules: 'moduleRepository',
    getLessonsByModuleId: 'lessonRepository',
    getLessonById: 'lessonRepository',
    getLessonNodes: 'lessonRepository',
    getLessonStatus: 'lessonRepository',
    getStreak: 'streakRepository',
    updateStreak: 'streakRepository',
    updateStreakFromCloud: 'streakRepository',
    getExercisesByLessonId: 'exerciseRepository',
    saveUserProgress: 'userProgressRepository',
    getCompletedLessons: 'userProgressRepository',
    setCompletedLessons: 'userProgressRepository',
    clearUserProgress: 'userProgressRepository',
    isLessonCompleted: 'userProgressRepository',
    saveInfinityScore: 'infinityProgressRepository',
    getInfinityScore: 'infinityProgressRepository',
    getAllInfinityProgress: 'infinityProgressRepository',
    saveInfinityScoreBulk: 'infinityProgressRepository'
};

files.forEach(file => {
    if (file.includes('api_local.ts') || file.includes('repositories') || file.includes('db_local')) return; // skip db_local stuff
    if (!fs.existsSync(file)) return;

    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('api_local') && !content.includes('db_local')) return;

    // Find imports from db_local/api_local or similar
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*)db_local(?:[\\/]api_local)?(?:[\\/]index)?['"];?/g;
    let match;
    let replacements = [];

    while ((match = importRegex.exec(content)) !== null) {
        replacements.push({
            fullMatch: match[0],
            importListStr: match[1],
            pathPrefix: match[2]
        });
    }

    if (replacements.length === 0) return;

    let changed = false;

    replacements.forEach(({ fullMatch, importListStr, pathPrefix }) => {
        let newSourcePath = pathPrefix + 'db_local/repositories';

        content = content.replace(fullMatch, '___TEMP_IMPORT_MARKER___');

        const importList = importListStr.split(',').map(s => s.trim()).filter(Boolean);
        let newImportsSet = new Set();

        importList.forEach(importedItem => {
            const parts = importedItem.split(/\s+as\s+/);
            const cleanName = parts[0].trim();
            const alias = parts.length > 1 ? parts[1].trim() : cleanName;

            if (mappings[cleanName]) {
                const repoVar = mappings[cleanName];
                newImportsSet.add(repoVar);
                // Replace usages where there is a word boundary
                const usageRegex = new RegExp(`\\b${alias}\\b`, 'g');
                content = content.replace(usageRegex, `${repoVar}.${cleanName}`);
            } else {
                newImportsSet.add(importedItem);
            }
        });

        const newImportStr = `import { ${Array.from(newImportsSet).join(', ')} } from '${newSourcePath}';`;
        content = content.replace('___TEMP_IMPORT_MARKER___', newImportStr);
        changed = true;
    });

    if (changed) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log('Updated', file);
    }
});
