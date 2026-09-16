const { app, initDB } = require("./app");

const PORT = process.env.PORT || 3002;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Expense service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
