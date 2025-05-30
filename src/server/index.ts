import express from "express";
import cors from "cors";
import createApplicationRoute from "./actions/application/create";
import getApplicationRoute from "./actions/application/get";
import getApplicationByIdRoute from "./actions/application/getById";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/", createApplicationRoute);
app.use("/", getApplicationRoute);
app.use("/", getApplicationByIdRoute);

if (import.meta.url === `file://${process.cwd()}/src/server/index.ts`) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app; 
