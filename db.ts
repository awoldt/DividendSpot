import pg from "pg";
const { Pool } = pg;

console.log("DB_USER:", Deno.env.get("DB_USER"));
console.log("DB_PASSWORD:", Deno.env.get("DB_PASSWORD"));
console.log("DB_HOST:", Deno.env.get("DB_HOST"));
console.log("DB_PORT:", Deno.env.get("DB_PORT"));
console.log("DB_DATABASE:", Deno.env.get("DB_DATABASE"));

export const db = new Pool({
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  host: Deno.env.get("DB_HOST"),
  port: Deno.env.get("DB_PORT"),
  database: Deno.env.get("DB_DATABASE"),
});
