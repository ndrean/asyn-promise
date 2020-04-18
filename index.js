// import { openDB, deleteDB, wrap, unwrap } from "idb";
const openDB = require("idb");
async function doDatabaseStuff() {
  const db = await openDB("testdb", 1);
}
