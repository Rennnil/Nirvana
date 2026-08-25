import { faker } from "@faker-js/faker";

class DataGenerator {
  static getCurrentFormattedDate() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  static getPowerUnitsCount() {
    return faker.number.int({ min: 1, max: 9 });
  }

  static getRandomDob(minAge = 15, maxAge = 75) {
    const dob = faker.date.birthdate({ min: minAge, max: maxAge, mode: "age" });
    const mm = String(dob.getMonth() + 1).padStart(2, "0");
    const dd = String(dob.getDate()).padStart(2, "0");
    const yyyy = dob.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  static getRandomCdlExpYears() {
    return faker.number.int({ min: 1, max: 20 });
  }

  static getRandomDobForDriver() {
    return this.getRandomDob(21, 65);
  }

  static getRandomDateOfHire() {
    const hireDate = faker.date.past({ years: 5 });
    const mm = String(hireDate.getMonth() + 1).padStart(2, "0");
    const dd = String(hireDate.getDate()).padStart(2, "0");
    const yyyy = hireDate.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
}

export default DataGenerator;
