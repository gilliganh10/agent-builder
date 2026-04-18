/**
 * Global test setup — runs once before each test file.
 *
 * Sets minimal environment so modules that read process.env at import time
 * (e.g. lib/db.ts) get deterministic, isolated values instead of touching a
 * real database.
 */
process.env.DATABASE_URL = "file:./tests/test.db";
(process.env as Record<string, string | undefined>).NODE_ENV = "test";
