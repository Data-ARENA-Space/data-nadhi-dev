module.exports = {
  async up(db) {
    // Processors
    await db.createCollection("Processors");
    await db.collection("Processors").createIndex(
      { processorId: 1 },
      { unique: true }
    );
  },

  async down(db) {
    await db.collection("Processors").drop();
  }
};