import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "#db/queries/employees";
import express from "express";
import { body, param, validationResult } from "express-validator";
const MAX_INT_SQL = 2147483647;

const errorThrower = new Map();
const NO_BODY = "NO_BODY";
const MISSING_FIELD = "MISSING_FIELD";
const NOT_POSITIVE_INT = "NOT_POSITIVE_INT";
const DOES_NOT_EXIST = "DNE";
errorThrower.set(NO_BODY, () => {
  const error = new Error("No body provided");
  error.code = 400;
  return error;
});
errorThrower.set(MISSING_FIELD, () => {
  const error = new Error("Missing field");
  error.code = 400;
  return error;
});
errorThrower.set(NOT_POSITIVE_INT, () => {
  const error = new Error("Not positive integer");
  error.code = 400;
  return error;
});
errorThrower.set(DOES_NOT_EXIST, () => {
  const error = new Error("Does not exist");
  error.code = 404;
  return error;
});

const validateBodyExists = () =>
  body().exists({ values: "falsy" }).withMessage(NO_BODY);
const validateValidBody = () =>
  body()
    .custom((value) => value.name && value.birthday && value.salary)
    .withMessage(MISSING_FIELD);
const validateId = () =>
  param()
    .custom((param) => {
      const id = +param.id;
      console.log("id is", id);
      return !isNaN(id) && Number.isInteger(id) && id > 0 && id <= MAX_INT_SQL;
    })
    .withMessage(NOT_POSITIVE_INT);

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    const employees = await getEmployees();
    return res.status(200).send(employees);
  })
  .post([validateBodyExists(), validateValidBody()], async (req, res, next) => {
    try {
      const codes = validationResult(req)
        .array()
        .map((elem) => elem.msg);
      console.log("codes are", codes);
      if (codes.length > 0) {
        throw errorThrower.get(codes[0])();
      }
      const newEmployee = await createEmployee({
        name: req.body.name,
        birthday: req.body.birthday,
        salary: req.body.salary,
      });
      return res.status(201).send(newEmployee);
    } catch (e) {
      next(e);
    }
  });

router
  .route("/:id")
  .get([validateId()], async (req, res, next) => {
    try {
      const codes = validationResult(req)
        .array()
        .map((elem) => elem.msg);
      if (codes.length > 0) {
        throw errorThrower.get(codes[0])();
      }
      const employee = await getEmployee(+req.params.id);
      return employee
        ? res.status(200).send(employee)
        : res.status(404).send(DOES_NOT_EXIST);
    } catch (e) {
      next(e);
    }
  })
  .put(
    [validateBodyExists(), validateValidBody(), validateId()],
    async (req, res, next) => {
      try {
        const codes = validationResult(req)
          .array()
          .map((elem) => elem.msg);
        if (codes.length > 0) {
          throw errorThrower.get(codes[0])();
        }
        const updatedEmployee = await updateEmployee({
          id: +req.params.id,
          name: req.body.name,
          birthday: req.body.birthday,
          salary: req.body.salary,
        });
        return updatedEmployee
          ? res.status(200).send(updatedEmployee)
          : res.status(404).send("No employee found to update");
      } catch (e) {
        next(e);
      }
    }
  )
  .delete([validateId()], async (req, res, next) => {
    const codes = validationResult(req)
      .array()
      .map((elem) => elem.msg);
    if (codes.length > 0) {
      throw errorThrower.get(codes[0])();
    }
    const deletedEmployee = await deleteEmployee(id);
    return deletedEmployee
      ? res.status(204).send()
      : res.status(404).send("No employee found!");
  });

export default router;
