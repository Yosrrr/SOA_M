const ExampleModel = require('../models/exampleModel');

exports.getExamples = async (req, res) => {
    try {
        const examples = await ExampleModel.find();
        res.status(200).json(examples);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving examples', error });
    }
};

exports.createExample = async (req, res) => {
    const newExample = new ExampleModel(req.body);
    try {
        const savedExample = await newExample.save();
        res.status(201).json(savedExample);
    } catch (error) {
        res.status(400).json({ message: 'Error creating example', error });
    }
};