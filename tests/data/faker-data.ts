// tests/data/faker-data.js
import { fakerEN_US as faker } from '@faker-js/faker';

  export const email = faker.internet.email();
  export const motDePasse = faker.internet.password();
  export const prenom = faker.person.firstName();
  export const nom = faker.person.lastName();
  export const address = faker.location.streetAddress();
  export const city = faker.location.city();
  export const state = faker.location.state();
  export const zipCode = faker.location.zipCode();
  export const phone = faker.phone.number();