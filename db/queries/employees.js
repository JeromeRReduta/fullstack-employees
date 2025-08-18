import db from "#db/client";

/** @returns the employee created according to the provided details */
export async function createEmployee({ name, birthday, salary }) {
  const { rows: employees } = await db.query({
    text: `INSERT INTO employees (name, birthday, salary)
            VALUES($1, $2, $3)
            RETURNING *
        `,
    values: [name, birthday, salary],
  });
  return employees[0];
}

// === Part 2 ===

/** @returns all employees */
export async function getEmployees() {
  const { rows } = await db.query({
    text: `SELECT * FROM employees`,
  });
  return rows;
}

/**
 * @returns the employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function getEmployee(id) {
  const { rows } = await db.query({
    text: `SELECT * FROM employees
            WHERE id=$1`,
    values: [id],
  });
  console.log("rows is", rows);
  return rows.length > 0 ? rows[0] : undefined; // in the event of multiple matches, returns the first match
}

/**
 * @returns the updated employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function updateEmployee({ id, name, birthday, salary }) {
  // TODO
}

/**
 * @returns the deleted employee with the given id
 * @returns undefined if employee with the given id does not exist
 */
export async function deleteEmployee(id) {
  // TODO
}
