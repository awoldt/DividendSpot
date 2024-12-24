import pg from "pg";
const { Pool } = pg;

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

export const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT)!,
  database: process.env.DB_DATABASE,
  max: 22,
  ssl: {
    rejectUnauthorized: false, // Optional: Disable strict validation (not recommended for production)
  },
});
