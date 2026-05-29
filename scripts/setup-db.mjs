import { execSync } from "child_process";

async function main() {
  const url = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error("No POSTGRES_PRISMA_URL or DATABASE_URL found in env");
    process.exit(1);
  }
  console.log("Database URL found, pushing schema...");
  execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
  console.log("Schema pushed successfully!");
  console.log("Seeding data...");
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
  console.log("Seed completed!");
}

main().catch(console.error);
