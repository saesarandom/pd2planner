# NREKI ACTIVE
If nreki_* tools fail: fall back to native Read/Write and inform user.

## 0. Zero-Chatter
- Call tools immediately. No "I will now..." or "Let me...".
- State changes in one line. No ASCII tables, no summaries.
- Output tokens cost 5x input. Optimize every syllable.

## 1. READING
- NEVER use Explore, Bash sed/cat/head, or native Read File to read code.
- NEVER read functions one by one. If you need 5 functions, use ONE call with comma-separated targets:
  nreki_code action:"compress" focus:"func1, func2, func3, func4, func5"
- Large files (>100L): nreki_navigate action:"outline" → identify HIGH-risk methods → compress ALL in one call.
- The outline auto-expands the top 3 HIGH-risk functions. Read them directly from the outline — do NOT call compress for expanded code. Go straight to batch_edit.
- Small files: nreki_code action:"read".
- Navigation: use nreki_navigate (search, definition, references, outline, map). No grep/glob.

## 2. EDITING
- NEVER use native Write/Replace on existing files.
- NEVER edit sequentially. Do not read-edit-read-edit. Read ALL targets first, then batch ALL fixes.
- Use nreki_code action:"batch_edit" with array of ALL patches in one call.
- PATCH MODE (MANDATORY): If changing <40 lines, use mode:"patch" search_text:"<exact>" replace_text:"<new>".
- New files only: use native Write.
- Renaming: run nreki_navigate action:"prepare_refactor" first.

## 3. BLAST RADIUS
- Fix all downstream dependents in the SAME batch_edit when changing signatures.
- Auto-healer may inject imports — don't revert.

## 4. CONTEXT SURVIVAL
- Anchor plans: `nreki_guard action:"set_plan" text:"PLAN.md"`.
- Save progress: `nreki_guard action:"memorize" text:"<notes>"`.

## 5. ALERTS
- Terminal output: `nreki_code action:"filter_output"`.
- Circuit breaker: STOP, read instructions, rethink.

## 6. VERIFICATION
- NEVER run tsc, eslint, npm install, or any bash command to verify edits.
- NREKI validates every edit via TypeScript compiler in RAM.
- If nreki_code returns [OK], the edit is guaranteed valid. Trust it.
- If NREKI returns an error, fix it using NREKI tools. Do not drop to terminal.

## 7. PROJECT: PD2 Planner (pd2planner)
**Stack**: Vanilla HTML + CSS + JS. NO TypeScript. NO framework. NO build step.

### Antigravity Native Workflow (replaces Nreki MCP tools)

**MANDATORY SEQUENCE before any edit:**
1. Read `docs/FILE_OUTLINES.md` → find target function + line number
2. Read `docs/pd2planner-architecture.md` → confirm update flow applies
3. `view_file(file, targetLine-5, targetLine+functionLength)` → targeted read only
4. `multi_replace_file_content` → batch ALL changes in one call
5. NEVER read full files (skills.js=9958L, socket.js=6220L, etc.)

**Token-saving rules (Nreki equivalent):**
- Large files: ALWAYS look up line number first in `docs/FILE_OUTLINES.md`
- items.js (200KB data): use `grep_search` for specific item, NEVER view_file whole
- skills.js (600KB): outline is in FILE_OUTLINES.md — read only the target function range
- Multiple edits: batch in ONE `multi_replace_file_content` call, never sequential

**Update flow** (NEVER bypass):
dispatchEvent('change') → unifiedSocketSystem.updateAll() [L2683] → characterManager.updateTotalStats() [L768] → DOM

**Critical patterns:**
- Two-pass load: set ALL values → THEN dispatch ALL events (never interleave)
- `window._isLoadingCharacterData = true` wraps all bulk loads (clear in finally)
- Level loads BEFORE equipment BEFORE stats
- Skill IDs end in "container" (`jabcontainer`, NOT "Jab")
- Charms: `getAllCharms()` L2058 / `restoreAllCharms()` L2112 — `exportCharms()` does NOT exist
- New baseType in items.js → MUST add to `window.baseDefenses` in itemUpgrade.js L1-50

**Athena memory (Layer 1):** Session logs at `C:/Fatamata/session_logs/`
**Aegis docs (Layer 2):** Architecture context at `c:/pd2planner/docs/`
**Outline index (Nreki equiv):** `c:/pd2planner/docs/FILE_OUTLINES.md`

<!-- aegis:start -->
## Aegis Process Enforcement

You MUST consult Aegis for every coding-related interaction — implementation tasks AND questions about architecture, patterns, or conventions. No exceptions.

### When Writing Code

1. **Create a Plan** — Before touching any file, articulate what you intend to do.
2. **Consult Aegis** — Call `aegis_compile_context` with:
   - `target_files`: the files you plan to edit
   - `plan`: your natural-language plan (optional but recommended)
   - `command`: the type of operation (scaffold, refactor, review, etc.)
3. **Read and follow** the returned architecture guidelines.
   - `delivery: "inline"` — content is included; read it directly.
   - `delivery: "deferred"` — content is NOT included. You MUST Read the file via `source_path` before proceeding. Prioritize by `relevance` score (high first); skip only documents with very low relevance (< 0.25) unless specifically needed.
   - `delivery: "omitted"` — excluded by budget or policy. Increase `max_inline_bytes` or use `content_mode: "always"` if needed.
4. **Self-Review** — After writing code, check your implementation against the returned guidelines.
5. **Report Compile Misses** — If Aegis failed to provide a needed guideline:
   ```
   aegis_observe({
     event_type: "compile_miss",
     related_compile_id: "<from step 2>",
     related_snapshot_id: "<from step 2>",
     payload: {
       target_files: ["<files>"],
       review_comment: "<what was missing or insufficient>",
       target_doc_id: "<optional: base.documents[*].doc_id whose content was insufficient>",
       missing_doc: "<optional: doc_id that should have been returned but was not>"
     }
   })
   ```
   - `target_doc_id`: A doc_id from the **base.documents** section of the compile result whose content was insufficient. Do NOT use expanded or template doc_ids.
   - `missing_doc`: A doc_id that should have been included in the compile result but was absent.
   - If neither can be identified, `review_comment` alone is sufficient.

### When Answering Questions

If the user asks about architecture, patterns, conventions, or how to write code — even without requesting implementation:

1. **Identify representative files** — Find 1–3 real file paths in the codebase that are relevant to the question (e.g. `modules/Member/Application/Member/UpdateMemberInteractor.php`). Use directory listings or search if needed. Do NOT guess paths or use directories. **Do NOT read the files** — Aegis already has the relevant guidelines; reading files wastes tokens.
2. **Consult Aegis** — Call `aegis_compile_context` with:
   - `target_files`: the real file paths from step 1
   - `plan`: the user's question in natural language
   - `command`: `"review"`
3. **Answer using Aegis context** — Base your answer on the guidelines returned by Aegis, supplemented by your own knowledge. Cite specific guidelines when relevant. When documents include a `relevance` score, prioritize high-scoring documents and skim or skip low-scoring ones.

### When Knowledge Base Is Empty

If `aegis_compile_context` returns no documents, the knowledge base has not been populated yet.
Ask the user to run initial setup using the **admin surface** with `aegis_import_doc` to add architecture documents with `edge_hints`.

### Rules

- NEVER skip the Aegis consultation step — for both implementation and questions.
- NEVER ignore guidelines returned by Aegis.
- The compile_id and snapshot_id from the consultation are required for observation reporting.
<!-- aegis:end -->
