import express from "express";
import employeeRouter from "#api/employees";
const app = express();
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Broken dang");
});
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Fullstack Employees API.");
});
app.use("/employees", employeeRouter);

app.use((err, req, res, next) => {
  res.status(err.code || 500).send(err.message ?? "Borken");
});

// TODO: this file!

export default app;
