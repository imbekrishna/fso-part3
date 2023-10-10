const generateId = () => {
  return Math.floor(Math.random() * (10000 - 100) + 100);
};

const personExists = (persons, name) => {
  let exists = persons.find(
    (person) => person.name.toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  generateId,
  personExists,
};
