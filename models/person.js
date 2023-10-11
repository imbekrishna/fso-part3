const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
    .connect(url)
    .then((e) => console.log("Connected to mongoDB"))
    .catch((error) =>
        console.log("Error connecting to mongoDB", error.message)
    );

const personSchema = new mongoose.Schema({
    name: { type: String, minLength: 3, required: true },
    number: {
        type: String,
        validate: {
            validator: (v) => /^\d{2,3}-\d{6,}/.test(v),
            message: props => `Invalid phone number ${props.value}. Min length: 8 Format:xxx-xxxxx`
        },
        required: [true, 'Number required']
    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);
