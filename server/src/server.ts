import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });
};

startServer().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", error);
  process.exit(1);
});

