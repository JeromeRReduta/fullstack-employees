import db from "#db/client";
import { allFakers, faker } from "@faker-js/faker";
import { createEmployee } from "#db/queries/employees";
const NUMBER_OF_ENTRIES = 10;

await db.connect();
await seedEmployees();
await db.end();
console.log("🌱 Database seeded.");

function createFakeEmployee() {
  return {
    name: faker.person.fullName(),
    birthday: faker.date.birthdate(),
    salary: faker.number.int({ min: 0, max: 1000000 }),
  };
}

async function seedEmployees() {
  const employees = Array.from(
    { length: NUMBER_OF_ENTRIES },
    createFakeEmployee
  );
  for (let employee of employees) {
    await createEmployee(employee);
  }
}
