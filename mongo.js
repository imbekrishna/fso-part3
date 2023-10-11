const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Please provide password");
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://be-krishna:${password}@cluster0.2kz3u.mongodb.net/fullstack?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
    const newPerson = new Person({
        name,
        number,
    });

    newPerson.save().then((result) => {
        console.log(
            `added ${result.name} number ${result.number} to phonebook`
        );
        mongoose.connection.close();
    });
} else {
    Person.find({}).then((results) => {
        console.log("phonebook:");
        results.forEach((result) => {
            console.log(`${result.name} ${result.number}`);
        });

        mongoose.connection.close();
    });
}
