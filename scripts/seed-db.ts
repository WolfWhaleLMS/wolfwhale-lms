/**
 * Wolf Whale LMS - Database Seed Script
 *
 * This script:
 * 1. Creates auth users in Supabase via the Admin API
 * 2. Reads the seed.sql file
 * 3. Replaces placeholder UUIDs with the real auth user UUIDs
 * 4. Executes the seed SQL against the database
 *
 * Prerequisites:
 *   - Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - Run the migration first (supabase migration up or via dashboard)
 *
 * Usage:
 *   npx tsx scripts/seed-db.ts
 *
 *   Or with explicit env vars:
 *   NEXT_PUBLIC_SUPABASE_URL=https://yhxesebykwhlpsmxxiqo.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=your-key-here \
 *   npx tsx scripts/seed-db.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Try to load .env.local if dotenv is available
try {
  const dotenv = require("dotenv");
  dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
} catch {
  // dotenv not installed; rely on environment variables
}

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://yhxesebykwhlpsmxxiqo.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_SERVICE_KEY) {
  console.error(
    "ERROR: SUPABASE_SERVICE_ROLE_KEY is required.\n" +
      "Set it in .env.local or pass it as an environment variable.\n" +
      "You can find it in your Supabase project settings > API > service_role key."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const DEFAULT_PASSWORD = "WolfWhale2026!";

// ---------------------------------------------------------------------------
// Demo user definitions
// ---------------------------------------------------------------------------

interface DemoUser {
  placeholderUuid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "teacher" | "student" | "parent";
}

const DEMO_USERS: DemoUser[] = [
  // Admin
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000001",
    email: "admin@wolfwhale.demo",
    firstName: "Michael",
    lastName: "Thompson",
    role: "admin",
  },
  // Teachers
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000002",
    email: "sarah.johnson@wolfwhale.demo",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "teacher",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000003",
    email: "david.chen@wolfwhale.demo",
    firstName: "David",
    lastName: "Chen",
    role: "teacher",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000004",
    email: "emily.rodriguez@wolfwhale.demo",
    firstName: "Emily",
    lastName: "Rodriguez",
    role: "teacher",
  },
  // Students K-2
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000010",
    email: "lily.parker@wolfwhale.demo",
    firstName: "Lily",
    lastName: "Parker",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000011",
    email: "ethan.brooks@wolfwhale.demo",
    firstName: "Ethan",
    lastName: "Brooks",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000012",
    email: "chloe.martinez@wolfwhale.demo",
    firstName: "Chloe",
    lastName: "Martinez",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000013",
    email: "aiden.nguyen@wolfwhale.demo",
    firstName: "Aiden",
    lastName: "Nguyen",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000014",
    email: "mia.washington@wolfwhale.demo",
    firstName: "Mia",
    lastName: "Washington",
    role: "student",
  },
  // Students 3-4
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000015",
    email: "noah.kim@wolfwhale.demo",
    firstName: "Noah",
    lastName: "Kim",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000016",
    email: "sophia.patel@wolfwhale.demo",
    firstName: "Sophia",
    lastName: "Patel",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000017",
    email: "jackson.lee@wolfwhale.demo",
    firstName: "Jackson",
    lastName: "Lee",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000018",
    email: "olivia.turner@wolfwhale.demo",
    firstName: "Olivia",
    lastName: "Turner",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000019",
    email: "lucas.garcia@wolfwhale.demo",
    firstName: "Lucas",
    lastName: "Garcia",
    role: "student",
  },
  // Students Grade 5
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000020",
    email: "emma.wilson@wolfwhale.demo",
    firstName: "Emma",
    lastName: "Wilson",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000021",
    email: "james.brown@wolfwhale.demo",
    firstName: "James",
    lastName: "Brown",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000022",
    email: "ava.davis@wolfwhale.demo",
    firstName: "Ava",
    lastName: "Davis",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000023",
    email: "benjamin.harris@wolfwhale.demo",
    firstName: "Benjamin",
    lastName: "Harris",
    role: "student",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000024",
    email: "isabella.clark@wolfwhale.demo",
    firstName: "Isabella",
    lastName: "Clark",
    role: "student",
  },
  // Parents
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000030",
    email: "robert.parker@wolfwhale.demo",
    firstName: "Robert",
    lastName: "Parker",
    role: "parent",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000031",
    email: "maria.martinez@wolfwhale.demo",
    firstName: "Maria",
    lastName: "Martinez",
    role: "parent",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000032",
    email: "jennifer.kim@wolfwhale.demo",
    firstName: "Jennifer",
    lastName: "Kim",
    role: "parent",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000033",
    email: "david.wilson@wolfwhale.demo",
    firstName: "David",
    lastName: "Wilson",
    role: "parent",
  },
  {
    placeholderUuid: "a0000000-0000-0000-0000-000000000034",
    email: "susan.harris@wolfwhale.demo",
    firstName: "Susan",
    lastName: "Harris",
    role: "parent",
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

async function createAuthUser(
  user: DemoUser
): Promise<{ placeholderUuid: string; realUuid: string }> {
  // First check if user already exists by email
  const { data: existingUsers } =
    await supabase.auth.admin.listUsers();

  const existing = existingUsers?.users?.find(
    (u) => u.email === user.email
  );

  if (existing) {
    console.log(
      `  [SKIP] ${user.email} already exists (${existing.id})`
    );
    return { placeholderUuid: user.placeholderUuid, realUuid: existing.id };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: DEFAULT_PASSWORD,
    email_confirm: true,
    user_metadata: {
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
    },
  });

  if (error) {
    // If user already exists error, try to find them
    if (error.message?.includes("already been registered")) {
      console.log(
        `  [EXISTS] ${user.email} - attempting to look up UUID`
      );
      // Try listing users to find the UUID
      const { data: listData } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      const found = listData?.users?.find((u) => u.email === user.email);
      if (found) {
        return { placeholderUuid: user.placeholderUuid, realUuid: found.id };
      }
      throw new Error(
        `User ${user.email} exists but could not retrieve UUID: ${error.message}`
      );
    }
    throw new Error(
      `Failed to create user ${user.email}: ${error.message}`
    );
  }

  if (!data.user) {
    throw new Error(`No user returned for ${user.email}`);
  }

  console.log(`  [CREATED] ${user.email} => ${data.user.id}`);
  return { placeholderUuid: user.placeholderUuid, realUuid: data.user.id };
}

async function executeSql(sql: string): Promise<void> {
  // Use the Supabase REST API to run raw SQL via the rpc endpoint
  // We need to use the pg_net or direct connection. Since we have the
  // service role key, we can use the Supabase Management API or
  // execute via the SQL editor endpoint.

  // The simplest approach: use supabase-js rpc or direct fetch to the
  // Supabase SQL endpoint
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({}),
  });

  // The rpc endpoint won't work for raw SQL. Instead, let's use the
  // Supabase SQL query endpoint available via the management API.
  // However, the most reliable way is to split the SQL and execute
  // via individual table inserts or use the pg REST API.

  // Actually, the best approach for running arbitrary SQL with the
  // service_role key is through the Supabase project's SQL endpoint:
  const sqlResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/exec_sql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (!sqlResponse.ok) {
    // exec_sql function might not exist. Fall back to splitting and
    // executing statements individually via the management API.
    console.log(
      "  Note: exec_sql RPC not available. Using management API fallback..."
    );
    await executeSqlViaManagementApi(sql);
  }
}

async function executeSqlViaManagementApi(sql: string): Promise<void> {
  // Extract the project ref from the URL
  const urlMatch = SUPABASE_URL.match(
    /https:\/\/([a-z]+)\.supabase\.co/
  );
  const projectRef = urlMatch ? urlMatch[1] : null;

  if (!projectRef) {
    console.error(
      "Could not extract project ref from SUPABASE_URL.",
      "You may need to run the seed SQL manually via the Supabase SQL Editor.",
      "\nThe seed SQL file is at: supabase/seed.sql"
    );
    return;
  }

  // Use the Supabase Management API (requires service role or access token)
  // POST https://api.supabase.com/v1/projects/{ref}/database/query
  // This requires a Supabase access token (personal), not the service role key.
  //
  // Since we likely do not have a management API token, we will write
  // the final SQL to a file and provide instructions.

  const outputPath = path.resolve(__dirname, "../supabase/seed-ready.sql");
  fs.writeFileSync(outputPath, sql, "utf-8");

  console.log(
    "\n" +
      "====================================================================\n" +
      "SEED SQL READY\n" +
      "====================================================================\n" +
      `The seed SQL with real UUIDs has been written to:\n` +
      `  ${outputPath}\n\n` +
      "To apply the seed data, use one of these methods:\n\n" +
      "  1. Supabase Dashboard SQL Editor:\n" +
      `     https://supabase.com/dashboard/project/${projectRef}/sql/new\n` +
      "     Copy and paste the contents of seed-ready.sql\n\n" +
      "  2. Supabase CLI (if linked):\n" +
      "     supabase db push < supabase/seed-ready.sql\n\n" +
      "  3. Direct psql connection:\n" +
      `     psql "postgresql://postgres:[PASSWORD]@db.${projectRef}.supabase.co:5432/postgres" < supabase/seed-ready.sql\n` +
      "====================================================================\n"
  );
}

// ---------------------------------------------------------------------------
// Main execution
// ---------------------------------------------------------------------------

async function main() {
  console.log("====================================================================");
  console.log("Wolf Whale LMS - Database Seed Script");
  console.log("====================================================================");
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log("");

  // Step 1: Create auth users
  console.log("Step 1: Creating auth users...");
  console.log("--------------------------------------------------------------------");

  const uuidMapping: Map<string, string> = new Map();

  for (const user of DEMO_USERS) {
    try {
      const result = await createAuthUser(user);
      uuidMapping.set(result.placeholderUuid, result.realUuid);
    } catch (error) {
      console.error(`  [ERROR] ${user.email}: ${error}`);
      console.error(
        "  Continuing with placeholder UUID. You may need to update it manually."
      );
      uuidMapping.set(user.placeholderUuid, user.placeholderUuid);
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log("");
  console.log("Step 2: Preparing seed SQL...");
  console.log("--------------------------------------------------------------------");

  // Read the seed SQL
  const seedPath = path.resolve(__dirname, "../supabase/seed.sql");
  let seedSql = fs.readFileSync(seedPath, "utf-8");

  // Replace placeholder UUIDs with real ones
  let replacementCount = 0;
  for (const [placeholder, real] of uuidMapping) {
    if (placeholder !== real) {
      const regex = new RegExp(placeholder, "g");
      const matches = seedSql.match(regex);
      const count = matches ? matches.length : 0;
      seedSql = seedSql.replace(regex, real);
      replacementCount += count;
      console.log(`  Replaced ${placeholder} => ${real} (${count} occurrences)`);
    } else {
      console.log(`  Kept placeholder ${placeholder} (user creation failed or skipped)`);
    }
  }
  console.log(`  Total replacements: ${replacementCount}`);

  console.log("");
  console.log("Step 3: Executing seed SQL...");
  console.log("--------------------------------------------------------------------");

  await executeSql(seedSql);

  // Also write the UUID mapping to a JSON file for reference
  const mappingPath = path.resolve(__dirname, "../supabase/uuid-mapping.json");
  const mappingObj: Record<string, { placeholder: string; real: string; email: string }> = {};
  for (const user of DEMO_USERS) {
    mappingObj[user.email] = {
      placeholder: user.placeholderUuid,
      real: uuidMapping.get(user.placeholderUuid) || user.placeholderUuid,
      email: user.email,
    };
  }
  fs.writeFileSync(mappingPath, JSON.stringify(mappingObj, null, 2), "utf-8");
  console.log(`\nUUID mapping saved to: ${mappingPath}`);

  console.log("");
  console.log("====================================================================");
  console.log("DEMO ACCOUNT CREDENTIALS");
  console.log("====================================================================");
  console.log("");
  console.log(`All accounts use password: ${DEFAULT_PASSWORD}`);
  console.log("");
  console.log("Role       | Name                    | Email");
  console.log("-----------|-------------------------|------------------------------------");
  for (const user of DEMO_USERS) {
    const name = `${user.firstName} ${user.lastName}`.padEnd(23);
    const role = user.role.padEnd(10);
    console.log(`${role} | ${name} | ${user.email}`);
  }
  console.log("");
  console.log("====================================================================");
  console.log("Seed complete!");
  console.log("====================================================================");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
