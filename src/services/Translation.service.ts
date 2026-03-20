import TranslateText, { TranslateLanguage } from '@react-native-ml-kit/translate-text';

// ─────────────────────────────────────────────────────────────────────────────
// Base translator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Translates a plain text string using Google ML Kit On-Device Translation.
 * The model is downloaded automatically if it is not already present.
 */
export const translateText = async (
  text: string,
  targetLanguage: TranslateLanguage = TranslateLanguage.SPANISH,
  sourceLanguage: TranslateLanguage = TranslateLanguage.ENGLISH
): Promise<string> => {
  try {
    const result = await TranslateText.translate({
      text,
      sourceLanguage,
      targetLanguage,
      downloadModelIfNeeded: true,
    });
    // The native module resolves to a string at runtime
    return result as unknown as string;
  } catch (error) {
    console.error('[TranslationService] Error during translation:', error);
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Table helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true if the row is a GFM alignment/separator row: | :--- | ---: | */
const isTableSeparator = (row: string): boolean =>
  /^\|[\s|:–-]+\|$/.test(row.trim());

/** Splits "| a | b | c |" into ["a", "b", "c"] */
const splitTableRow = (row: string): string[] =>
  row.trim().split('|').slice(1, -1).map(c => c.trim());

/** Rebuilds a row from its cells */
const joinTableRow = (cells: string[]): string =>
  `| ${cells.join(' | ')} |`;

/**
 * Translates a GFM table while preserving its structure.
 * - Separator rows (| --- |) are kept verbatim.
 * - Every other cell is translated individually.
 * - Falls back to the original cell on error.
 */
const translateTable = async (
  tableText: string,
  targetLanguage: TranslateLanguage,
  sourceLanguage: TranslateLanguage,
): Promise<string> => {
  const lines = tableText.trimEnd().split('\n');
  const resultLines: string[] = [];

  for (const line of lines) {
    if (!line.trim().startsWith('|')) {
      resultLines.push(line);
      continue;
    }
    if (isTableSeparator(line)) {
      resultLines.push(line); // keep alignment row exactly as-is
      continue;
    }

    const cells = splitTableRow(line);
    const translatedCells = await Promise.all(
      cells.map(async (cell) => {
        if (!cell) return cell;
        try {
          return await translateText(cell, targetLanguage, sourceLanguage);
        } catch {
          return cell; // graceful degradation per cell
        }
      }),
    );
    resultLines.push(joinTableRow(translatedCells));
  }

  return resultLines.join('\n');
};

// ─────────────────────────────────────────────────────────────────────────────
// Markdown-aware translation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Translates Markdown content while preserving its structure.
 *
 * ## Strategy
 *
 * ### Shielding
 * Every non-translatable fragment is replaced by an opaque token.
 * The `§` character (U+00A7) is never emitted by ML Kit, making it a safe
 * sentinel. Tokens are split into two families:
 *
 * - **Inline** (`§In§`): inline code, URLs, HTML tags, list markers.
 *   Restored by eating only surrounding spaces/tabs (`[ \t]*`).
 *
 * - **Block** (`§Bn§`): fenced/indented code blocks, GFM tables.
 *   Also restored with `[ \t]*` — newlines are already preserved by the
 *   block-split/join logic and must NOT be consumed.
 *
 * ### Translation
 * The shielded text is split on two-or-more blank lines. Each logical block
 * is translated independently. Blocks that contain no real prose (lone tokens,
 * horizontal rules, …) are skipped entirely.
 *
 * ### Tables
 * Tables are shielded as block tokens so the translator never sees `|`
 * delimiters or alignment rows. After the full document is reassembled,
 * each table is translated cell-by-cell via `translateTable`.
 *
 * ### Lists
 * List markers (`- `, `* `, `1. `, …) and their leading indentation are
 * shielded as inline tokens. The translator only sees the item text;
 * markers are re-injected verbatim during restoration.
 *
 * ### Graceful degradation
 * Any block or cell that fails to translate is left in the source language,
 * so the output is always structurally valid Markdown.
 */
export const translateMd = async (
  markdown: string,
  targetLanguage: TranslateLanguage = TranslateLanguage.SPANISH,
  sourceLanguage: TranslateLanguage = TranslateLanguage.ENGLISH,
): Promise<string> => {

  // ── 1. Dual-family token vault ───────────────────────────────────────────────
  //
  // BUG FIX vs previous version: restoration uses `[ \t]*` instead of `\s*`.
  // Using `\s*` would silently eat the `\n\n` separators around block tokens,
  // collapsing blank lines and breaking the document structure.

  const inlineVault = new Map<string, string>(); // §In§ → original
  const blockVault = new Map<string, string>(); // §Bn§ → original
  let ii = 0;
  let bi = 0;

  const shieldInline = (raw: string): string => {
    const token = `§I${ii++}§`;
    inlineVault.set(token, raw);
    return token;
  };

  const shieldBlock = (raw: string): string => {
    const token = `§B${bi++}§`;
    blockVault.set(token, raw);
    return token;
  };

  // ── 2. Protect non-translatable fragments ───────────────────────────────────
  let shielded = markdown;

  // ── 2a. Block-level elements (order matters) ─────────────────────────────────

  // Fenced code blocks  (``` … ``` or ~~~ … ~~~), including the language tag
  shielded = shielded.replace(
    /(`{3,}|~{3,})[^\n]*\n[\s\S]*?\1/g,
    m => shieldBlock(m),
  );

  // Indented code blocks (4 spaces or 1 tab at the start of the line)
  shielded = shielded.replace(
    /^((?:(?: {4}|\t)[^\n]*\n?)+)/gm,
    m => shieldBlock(m),
  );

  // GFM tables — one or more consecutive lines that start with `|`.
  // Must run BEFORE list-marker shielding to avoid `|` confusion.
  // tableRegistry maps each block token to its raw table text so we can
  // translate cells separately after the main document is reassembled.
  const tableRegistry = new Map<string, string>(); // §Bn§ → rawTable
  shielded = shielded.replace(/^(\|.+\n?)+/gm, (match) => {
    const token = shieldBlock(match);
    tableRegistry.set(token, match);
    return token;
  });

  // ── 2b. Inline elements ──────────────────────────────────────────────────────

  // Inline code  (`…`)
  shielded = shielded.replace(/`[^`\n]+`/g, m => shieldInline(m));

  // Images  ![alt](url) — shield whole tag; alt is usually a filename
  shielded = shielded.replace(/!\[[^\]]*\]\([^)]*\)/g, m => shieldInline(m));

  // Links  [visible text](url) — label stays translatable, URL is shielded
  shielded = shielded.replace(
    /(\[[^\]]*\])\(([^)]+)\)/g,
    (_, label, url) => `${label}(${shieldInline(url)})`,
  );

  // Bare URLs (http / https)
  shielded = shielded.replace(/https?:\/\/\S+/g, m => shieldInline(m));

  // Inline HTML tags  (<br />, <span class="x">, …)
  shielded = shielded.replace(/<[^>]+>/g, m => shieldInline(m));

  // List markers — shield the leading indent + marker + space on each list line.
  // Covers: "- ", "* ", "+ ", "1. ", "2) ", "  - " (nested), etc.
  // This ensures the translator only sees the item text, never the marker.
  shielded = shielded.replace(
    /^([ \t]*)([-*+]|\d+[.)]) /gm,
    (_, indent, marker) => shieldInline(indent + marker + ' '),
  );

  // ── 3. Translate segment by segment ─────────────────────────────────────────
  //
  // Two-level strategy to prevent ML Kit from corrupting inline tokens:
  //
  // Level A — block split (blank lines):
  //   Paragraphs, headings, and other prose blocks that have NO list-marker
  //   tokens are translated as a whole unit. This gives the model enough
  //   context for natural phrasing.
  //
  // Level B — line split (inside list-heavy blocks):
  //   If a block contains list-marker tokens (§I…§ at the start of a line)
  //   it is split further into individual lines and each line is translated
  //   separately. This is the key fix: sending a single line like
  //   "§I3§❌ _I **have seen** that movie." keeps the token short and isolated
  //   so ML Kit cannot mangle it into "s3ns" or similar garbage.

  /** Translate one prose unit, skip if no real text. */
  const translateUnit = async (text: string): Promise<string> => {
    const t = text.trim();
    const skip =
      !t ||
      /^(§[BI]\d+§\s*)+$/.test(t) ||   // only tokens
      /^[-*_]{3,}$/.test(t) ||          // horizontal rule
      /^#{1,6}\s*$/.test(t);            // empty heading marker
    if (skip) return text;
    try {
      return await translateText(t, targetLanguage, sourceLanguage);
    } catch {
      console.warn('[TranslationService] Unit translation failed, keeping original.');
      return text;
    }
  };

  /** True when a block contains at least one shielded list-marker at line start. */
  const hasListTokens = (text: string): boolean =>
    /^§I\d+§/m.test(text);

  const blocks = shielded.split(/(\n{2,})/); // odd elements = blank separators
  const outputBlocks: string[] = [];

  for (const segment of blocks) {
    // Blank-line separators pass through unchanged
    if (/^\n+$/.test(segment)) {
      outputBlocks.push(segment);
      continue;
    }

    if (hasListTokens(segment)) {
      // Level B: translate line by line to keep tokens short and safe
      const lines = segment.split('\n');
      const translatedLines = await Promise.all(lines.map(translateUnit));
      outputBlocks.push(translatedLines.join('\n'));
    } else {
      // Level A: translate the whole block at once
      outputBlocks.push(await translateUnit(segment));
    }
  }

  let result = outputBlocks.join('');

  // ── 4. Restore inline tokens ─────────────────────────────────────────────────
  // `[ \t]*` eats only horizontal whitespace, so newlines are never consumed.
  for (const [token, original] of inlineVault) {
    result = result.replace(new RegExp(`[ \\t]*${token}[ \\t]*`, 'g'), original);
  }

  // ── 5. Restore block tokens, then translate tables cell-by-cell ──────────────
  for (const [token, original] of blockVault) {
    result = result.replace(new RegExp(`[ \\t]*${token}[ \\t]*`, 'g'), original);
  }

  // Tables are now restored as raw text. Translate each cell in place.
  // We use a replacer function to avoid issues with `$` in the replacement string.
  for (const rawTable of tableRegistry.values()) {
    if (!result.includes(rawTable)) continue;
    try {
      const translatedTable = await translateTable(rawTable, targetLanguage, sourceLanguage);
      result = result.replace(rawTable, () => translatedTable);
    } catch {
      console.warn('[TranslationService] Table translation failed, keeping original.');
    }
  }

  // ── 6. Cosmetic fixes for delimiter-spacing artefacts ────────────────────────
  // ML Kit occasionally pads Markdown syntax characters with extra spaces.
  result = result
    // Bold   **text**  and  __text__
    .replace(/\*\*\s+([\s\S]*?)\s+\*\*/g, '**$1**')
    .replace(/_{2}\s+([\s\S]*?)\s+_{2}/g, '__$1__')
    // Italic  *text*  and  _text_  (lookarounds prevent matching ** / __)
    .replace(/(?<!\*)\*\s+(.*?)\s+\*(?!\*)/g, '*$1*')
    .replace(/(?<!_)_\s+(.*?)\s+_(?!_)/g, '_$1_')
    // Heading marker spacing:  "##  Title" → "## Title"
    .replace(/^(#{1,6})\s{2,}/gm, '$1 ')
    // Link syntax:  "[ text ] ( url )" → "[text](url)"
    .replace(/\[\s*(.*?)\s*\]\s*\(/g, '[$1](')
    // Blockquote marker spacing:  ">  text" → "> text"
    .replace(/^(>+)\s{2,}/gm, '$1 ');

  return result.trim();
};