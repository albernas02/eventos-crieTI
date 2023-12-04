import DB from "./db";
import server from "./server";

async function main(): Promise<void> {
  await (await DB.initialize()).synchronize();

  server.start();
}

main();