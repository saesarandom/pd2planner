#!/usr/bin/env node
/**
 * aegis-import.mjs — imports pd2planner docs into Aegis DB
 * Run: node docs/aegis-import.mjs
 */
import { spawn } from 'child_process';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dir, '..').replace(/\\/g, '/');

// Windows: use cmd.exe to launch npx (resolves .ps1 scripts correctly)
const AEGIS_ARGS = ['@fuwasegu/aegis', '--surface', 'admin', '--project-root', PROJECT_ROOT];

const DOCS = [
  {
    file_path: join(__dir, 'pd2planner-architecture.md').replace(/\\/g, '/'),
    doc_id: 'pd2planner-architecture',
    title: 'PD2 Planner Architecture Guide',
    kind: 'guideline',
    tags: ['architecture', 'global-objects', 'update-flow', 'file-map'],
    edge_hints: [
      { source_type: 'path', source_value: '*.js',           edge_type: 'path_requires' },
      { source_type: 'path', source_value: 'socket.js',      edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'character.js',   edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'skills.js',      edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'main.js',        edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'items.js',       edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'itemUpgrade.js', edge_type: 'file_requires' },
    ],
  },
  {
    file_path: join(__dir, 'pd2planner-data-patterns.md').replace(/\\/g, '/'),
    doc_id: 'pd2planner-data-patterns',
    title: 'PD2 Planner Data Patterns & Bug Playbook',
    kind: 'guideline',
    tags: ['patterns', 'bugs', 'loading', 'two-pass', 'skills', 'charms', 'defense'],
    edge_hints: [
      { source_type: 'path', source_value: 'character-data.js', edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'character.js',      edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'skills.js',         edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'inventory.js',      edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'itemUpgrade.js',    edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'main.js',           edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'randomBuild.js',    edge_type: 'file_requires' },
      { source_type: 'path', source_value: 'corrupt.js',        edge_type: 'file_requires' },
    ],
  },
];

// ── MCP stdio client ────────────────────────────────────────────────
class McpClient {
  constructor(proc) {
    this.proc = proc;
    this.id = 1;
    this.buf = '';
    this.queue = new Map(); // id → {resolve, reject, timer}
    proc.stdout.on('data', d => this._feed(d.toString()));
    proc.stderr.on('data', () => {});
    proc.on('error', e => console.error('[proc error]', e.message));
  }

  _feed(chunk) {
    this.buf += chunk;
    while (true) {
      // Try Content-Length framing
      const hEnd = this.buf.indexOf('\r\n\r\n');
      if (hEnd !== -1) {
        const lenM = this.buf.slice(0, hEnd).match(/Content-Length:\s*(\d+)/i);
        if (lenM) {
          const len = +lenM[1];
          const bodyStart = hEnd + 4;
          if (this.buf.length >= bodyStart + len) {
            const body = this.buf.slice(bodyStart, bodyStart + len);
            this.buf = this.buf.slice(bodyStart + len);
            this._dispatch(body);
            continue;
          }
          break; // wait for more data
        }
      }
      // Newline-delimited JSON fallback
      const nl = this.buf.indexOf('\n');
      if (nl !== -1 && this.buf.trimStart().startsWith('{')) {
        const line = this.buf.slice(0, nl).trim();
        this.buf = this.buf.slice(nl + 1);
        if (line) this._dispatch(line);
        continue;
      }
      break;
    }
  }

  _dispatch(raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (msg.id != null && this.queue.has(msg.id)) {
      const { resolve, timer } = this.queue.get(msg.id);
      clearTimeout(timer);
      this.queue.delete(msg.id);
      resolve(msg);
    }
  }

  send(method, params) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      const body = JSON.stringify({ jsonrpc: '2.0', id, method, params });
      const timer = setTimeout(() => {
        if (this.queue.has(id)) { this.queue.delete(id); reject(new Error(`Timeout: ${method}`)); }
      }, 25000);
      this.queue.set(id, { resolve, reject, timer });
      this.proc.stdin.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
    });
  }

  call(tool, args) { return this.send('tools/call', { name: tool, arguments: args }); }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function getText(resp) {
  return resp?.result?.content?.[0]?.text
    ?? resp?.result?.content?.map?.(c => c.text).join('\n')
    ?? JSON.stringify(resp?.result ?? resp?.error ?? resp);
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Launching Aegis admin surface via cmd.exe...');

  const proc = spawn('cmd.exe', ['/c', 'npx', ...AEGIS_ARGS], {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  });

  const client = new McpClient(proc);

  console.log('⏳ Waiting for server boot (6s)...');
  await sleep(6000);

  // Initialize
  console.log('🤝 Initializing MCP...');
  const init = await client.send('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'pd2planner-importer', version: '1.0.0' },
  });
  const info = init.result?.serverInfo;
  console.log(`   ✅ Connected: ${info?.name} ${info?.version ?? ''}`);

  // Import docs
  for (const doc of DOCS) {
    console.log(`\n📄 Importing "${doc.doc_id}"...`);
    let resp;
    try {
      resp = await client.call('aegis_import_doc', {
        file_path:  doc.file_path,
        doc_id:     doc.doc_id,
        title:      doc.title,
        kind:       doc.kind,
        tags:       doc.tags,
        edge_hints: doc.edge_hints,
      });
    } catch (e) {
      console.error('   ❌ Import failed:', e.message);
      continue;
    }

    const text = getText(resp);
    console.log('   Result:', text.slice(0, 500));

    // Extract UUIDs and approve proposals
    const uuids = [...new Set(
      [...text.matchAll(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi)]
        .map(m => m[0])
    )];

    for (const pid of uuids) {
      await sleep(600);
      console.log(`   ⚡ Approving proposal ${pid}...`);
      try {
        const ar = await client.call('aegis_approve_proposal', { proposal_id: pid });
        console.log('   ', getText(ar).slice(0, 120));
      } catch (e) {
        console.error('   Approve error:', e.message);
      }
    }
    await sleep(800);
  }

  console.log('\n✅ Aegis import complete!');
  console.log('   Docs in DB: pd2planner-architecture, pd2planner-data-patterns');
  console.log('   Test: aegis_compile_context({ target_files: ["socket.js"] })');

  proc.stdin.end();
  await sleep(300);
  proc.kill('SIGTERM');
  process.exit(0);
}

main().catch(e => { console.error('\n💥 Fatal:', e.message); process.exit(1); });
