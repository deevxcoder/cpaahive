import { init } from '@instantdb/react';

// Replace with your actual InstantDB App ID
const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || '51c734c6-9638-400e-a002-3ab53761c839';

import schema from '@/instant.schema';

export const db = init({ appId: APP_ID, schema });
