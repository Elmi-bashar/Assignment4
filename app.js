const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// Middleware
app.use(express.json());

// Routes
const dataRouter = require("./api/data.js");
app.use("/data", dataRouter);

// Swagger
const swaggerDocument = YAML.load("./openapi.yaml"); // make sure the file is named openapi.yaml
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
