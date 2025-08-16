import pg from "pg";
console.log("url here is", process.env.DATABASE_URL);
const db = new pg.Client(process.env.DATABASE_URL);
export default db;
