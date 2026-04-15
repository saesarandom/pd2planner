# Aegis Setup Guide — PD2 Planner
## Run this ONCE in your AI coding tool (Claude Code / Cursor)

Nreki and the `.mcp.json` are already active. Aegis just needs its database initialized.
Run the following sequence in order using the **aegis-admin** MCP surface:

---

### Step 1 — Initialize Aegis DB

```
aegis_init_detect({ "project_root": "c:/pd2planner", "skip_template": true })
```
→ Copy the `preview_hash` from the response, then:

```
aegis_init_confirm({ "preview_hash": "<hash from above>" })
```

---

### Step 2 — Deploy Adapter Rules

After init, run in terminal:
```powershell
npx @fuwasegu/aegis deploy-adapters --project-root "c:/pd2planner"
```
This generates `.cursor/rules/aegis-process.mdc` (Cursor) or appends to `CLAUDE.md` (Claude Code).

---

### Step 3 — Import Architecture Docs

Using the **aegis-admin** MCP surface, import both docs:

```
aegis_import_doc({
  "file_path": "c:/pd2planner/docs/pd2planner-architecture.md",
  "doc_id": "pd2planner-architecture",
  "title": "PD2 Planner Architecture Guide",
  "kind": "guideline",
  "tags": ["architecture", "global-objects", "update-flow"],
  "edge_hints": [
    { "source_type": "path", "source_value": "*.js", "edge_type": "path_requires" },
    { "source_type": "path", "source_value": "socket.js", "edge_type": "file_requires" },
    { "source_type": "path", "source_value": "character.js", "edge_type": "file_requires" },
    { "source_type": "path", "source_value": "skills.js", "edge_type": "file_requires" },
    { "source_type": "path", "source_value": "main.js", "edge_type": "file_requires" }
  ]
})
```

```
aegis_import_doc({
  "file_path": "c:/pd2planner/docs/pd2planner-data-patterns.md",
  "doc_id": "pd2planner-data-patterns",
  "title": "PD2 Planner Data Patterns & Bug Playbook",
  "kind": "guideline",
  "tags": ["patterns", "bugs", "loading", "skills", "charms", "defense"],
  "edge_hints": [
    { "source_type": "path", "source_value": "character-data.js", "edge_type": "file_requires" },
    { "source_type": "path", "source_value": "character.js", "edge_type": "file_requires" },
    { "source_type": "path", "source_value": "skills.js", "edge_type": "file_requires" },
    { "source_type": "path", "source_value": "inventory.js", "edge_type": "file_requires" },
    { "source_type": "path", "source_value": "itemUpgrade.js", "edge_type": "file_requires" },
    { "source_type": "path", "source_value": "main.js", "edge_type": "file_requires" }
  ]
})
```

---

### Step 4 — Approve Proposals

```
aegis_list_proposals({ "status": "pending" })
```
Approve each returned `proposal_id`:
```
aegis_approve_proposal({ "proposal_id": "<id>" })
```

---

### Step 5 — Verify

Test that context compiles correctly for a target file:
```
aegis_compile_context({
  "target_files": ["socket.js"],
  "plan": "Add a new stat calculation"
})
```
Should return both architecture docs as context.

---

### Future — Keeping Aegis in Sync

When you update `docs/pd2planner-architecture.md` or `docs/pd2planner-data-patterns.md`:
```
aegis_sync_docs()
```
Then approve the generated update proposals.

---

## How the 3-Layer Stack Works in Practice

```
You start working on socket.js
  ↓
1. Aegis: aegis_compile_context({ target_files: ["socket.js"] })
   → Returns: architecture guide + data patterns (deterministic, no hallucination)
  ↓
2. Nreki: nreki_navigate action:"outline" path:"socket.js"
   → Returns: structural map with HIGH/MED/LOW risk scores (no full read needed)
  ↓
3. Nreki: nreki_code action:"compress" path:"socket.js" focus:"calculateAllStats"
   → Returns: only calculateAllStats + its dependencies (98% token reduction)
  ↓
4. Nreki: nreki_code action:"batch_edit" 
   → Validates in RAM via AST, writes to disk only if clean
```
