module.exports = {
  mongodb: {
    url: "mongodb://mongo:27017",
    databaseName: "datanadhi_dev",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  migrationsDir: "mongo-migrations",
  changelogCollectionName: "changelog",
};
