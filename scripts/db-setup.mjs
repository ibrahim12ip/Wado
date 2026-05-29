import { execSync } from "child_process";

const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
if (url) {
  console.log("Database URL found, setting up database...\n");
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
  console.log("\nSeeding database...\n");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
  console.log("\nDatabase setup complete!");
} else {
  console.log("No DATABASE_URL found, skipping database setup.");
}
