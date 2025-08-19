import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "#db/queries/employees";
import express from "express";
const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    const employees = await getEmployees();
    return res.status(200).send(employees);
  })
  .post(async (req, res) => {
    if (!req.body) {
      return res.status(400).send("Body not provided");
    }
    const isBodyInvalid =
      !req.body.name || !req.body.birthday || !req.body.salary;
    if (isBodyInvalid) {
      return res.status(400).send("Missing required field");
    }
    const newEmployee = await createEmployee({
      name: req.body.name,
      birthday: req.body.birthday,
      salary: req.body.salary,
    });
    return res.status(201).send(newEmployee);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const MAX_INT_SQL = 2147483647;
    const id = +req.params.id;
    console.log("id is", id);
    console.log("larger than max?", id > MAX_INT_SQL);
    if (isNaN(id) || id <= 0 || id > MAX_INT_SQL || !Number.isInteger(id)) {
      return res.status(400).send("Not positive integer!");
    }
    const employee = await getEmployee(id);
    if (!employee) {
      return res.status(404).send("No employee found!");
    }
    return res.status(200).send(employee);
  })
  .put(async (req, res) => {
    if (!req.body) {
      return res.status(400).send("No body!");
    }
    const isBodyInvalid =
      !req.body.name || !req.body.birthday || !req.body.salary;
    if (isBodyInvalid) {
      return res.status(400).send("Missing required field");
    }
    const MAX_INT_SQL = 2147483647;
    const id = +req.params.id;
    console.log("id is", id);
    console.log("larger than max?", id > MAX_INT_SQL);
    if (isNaN(id) || id <= 0 || id > MAX_INT_SQL || !Number.isInteger(id)) {
      return res.status(400).send("Not positive integer!");
    }
    const updatedEmployee = await updateEmployee({
      id: id,
      name: req.body.name,
      birthday: req.body.birthday,
      salary: req.body.salary,
    });
    if (!updatedEmployee) {
      return res.status(404).send("No employee found to update");
    }
    return res.status(200).send(updatedEmployee);
  })
  .delete(async (req, res) => {
    const MAX_INT_SQL = 2147483647;
    const id = +req.params.id;
    console.log("id is", id);
    console.log("larger than max?", id > MAX_INT_SQL);
    if (isNaN(id) || id <= 0 || id > MAX_INT_SQL || !Number.isInteger(id)) {
      return res.status(400).send("Not positive integer!");
    }
    const deletedEmployee = await deleteEmployee(id);
    if (!deletedEmployee) {
      return res.status(404).send("No employee found!");
    }
    return res.status(204).send();
  });

export default router;
