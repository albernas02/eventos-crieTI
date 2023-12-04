import DB from "./db";
import server from "./server";

async function main(): Promise<void> {
  let db = await DB.initialize();
  
  await db.synchronize();

  server.start();
}

main();