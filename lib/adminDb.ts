import { init } from '@instantdb/admin';
import schema from '../instant.schema';

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || '51c734c6-9638-400e-a002-3ab53761c839';
const ADMIN_TOKEN = process.env.INSTANTDB_SECRET!;

if (!APP_ID || !ADMIN_TOKEN) {
    console.warn("InstantDB environment variables missing for adminDb. Server-side operations may fail.");
}

export const adminDb = init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
    schema,
});
