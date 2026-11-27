import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const db = new DatabaseSync(process.env.EASEDRIVE_DB_PATH || path.join(path.dirname(fileURLToPath(import.meta.url)), 'easedrive.db'));
const email = process.argv[2]?.toLowerCase();
if (!email) { console.error('Usage: npm run promote-admin -- user@example.com'); process.exit(1); }
const result = db.prepare("UPDATE users SET role='admin',verified=1 WHERE email=?").run(email);
if (!result.changes) { console.error('No account found with that email. Register first, then run this command.'); process.exit(1); }
console.log(`Promoted ${email} to administrator.`);
