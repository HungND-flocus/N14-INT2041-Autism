// Mock Supabase Client wrapper
// In production, replace with: 
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log("Supabase Mock Client Initialized");

export const supabase = {
    auth: {
        getUser: async () => ({ data: { user: { id: "mock-user-id" } }, error: null }),
        signInWithPassword: async () => ({ data: { session: {} }, error: null }),
        signOut: async () => ({ error: null })
    },
    from: (table) => ({
        select: (columns) => ({
            eq: async (col, val) => {
                console.log(`Mock DB Query: SELECT ${columns} FROM ${table} WHERE ${col} = ${val}`);
                return { data: [], error: null };
            },
            async then(resolve) {
                console.log(`Mock DB Query: SELECT ${columns} FROM ${table}`);
                resolve({ data: [], error: null });
            }
        }),
        insert: async (data) => {
            console.log(`Mock DB Insert to ${table}:`, data);
            return { data: [data], error: null };
        },
        update: async (data) => {
            console.log(`Mock DB Update to ${table}:`, data);
            return { data: [data], error: null };
        }
    })
};
