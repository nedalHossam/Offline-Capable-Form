const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Custom-Header"],
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
