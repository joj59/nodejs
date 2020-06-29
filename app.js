const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log('hello from the middddleweaaaaaaaaaaaaaaaaaaaaaaaaaaar');
    next();
});

app.use((req, res, next) => {
    console.log(
        'i must have called a thousand timeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeees'
    );
    next();
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// console.log(tours);

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    if (tour) {
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } else {
        res.status(404).json({
            status: 'failed',
            data: {
                invalid: 'parameter was invalid',
            },
        });
    }
};

const addTour = (req, res) => {
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

const editTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'updated tour..........',
        },
    });
};

const deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    });
};

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: {
            message: 'route not handled yet!',
        },
    });
};

const addUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: {
            message: 'route not handled yet!',
        },
    });
};

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: {
            message: 'route not handled yet!',
        },
    });
};

const editUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: {
            message: 'route not handled yet!',
        },
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        data: {
            message: 'route not handled yet!',
        },
    });
};

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', addTour );

// app.patch('/api/v1/tours/:id', editTour);

// app.delete('/api/v1/tours/:id', deleteTour);

const tourRouter = express.Router();
const usersRouter = express.Router();

app.route('/').get(getAllTours).post(addTour);

app.route('/:id').get(getTour).patch(editTour).delete(deleteTour);

app.route('/').get(getAllUsers).post(addUser);

app.route('/:id').get(getUser).patch(editUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`app running on port no ${port}`);
});
