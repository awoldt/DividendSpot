import pg from "pg";
const { Pool } = pg;

export const db = new Pool({
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  host: Deno.env.get("DB_HOST"),
  port: Deno.env.get("DB_PORT"),
  database: Deno.env.get("DB_DATABASE"),
});
