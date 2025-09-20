module.exports = {
  async up(db) {
    // Organisations
    await db.createCollection("Organisations");
    await db.collection("Organisations").createIndex({ organisationId: 1 }, { unique: true });

    // Projects
    await db.createCollection("Projects");
    await db.collection("Projects").createIndex(
      { projectId: 1, organisationId: 1 },
      { unique: true }
    );

    // Pipelines
    await db.createCollection("Pipelines");
    await db.collection("Pipelines").createIndex(
      { pipelineId: 1, projectId: 1, organisationId: 1 },
      { unique: true }
    );
  },

  async down(db) {
    await db.collection("Organisations").drop();
    await db.collection("Projects").drop();
    await db.collection("Pipelines").drop();
  }
};