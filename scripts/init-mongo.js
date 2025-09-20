const { up } = require("migrate-mongo");
const config = require("../migrate-mongo-config");

(async () => {
  try {
    console.log("🔄 Running migrations...");
    await up(config);
    console.log("✅ Migrations applied successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed", err);
    process.exit(1);
  }
})();
