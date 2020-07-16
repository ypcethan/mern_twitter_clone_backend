const faker = require('faker');

const randomName = faker.name.findName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.bizg
console.log(faker.image.avatar());
console.log(faker.image.image());
console.log(faker.internet.password());
console.log(faker.internet.userName());
console.log(faker.lorem.text());
console.log(randomName);
console.log(randomEmail);
