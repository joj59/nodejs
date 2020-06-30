const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
    console.log(`tour route param is ${val}`);

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'failed',
            data: {
                invalid: 'parameter was invalid',
            },
        });
    }

    next();
};

exports.checkBody = (req, res, next, val) => {
    console.log(`tour route param is ${req.body}`);

    if (req.body.name && req.body.price) {
        return res.status(404).json({
            status: 'failed',
            data: {
                invalid: 'body does not have name pr price!!!',
            },
        });
    }

    next();
};

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
};

exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
};

exports.addTour = (req, res) => {
    // console.log(req.body);

    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign(
        {
            id: newID,
        },
        req.body
    );

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );

    // res.status(200).send('done');
};

exports.editTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'updated tour..........',
        },
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
