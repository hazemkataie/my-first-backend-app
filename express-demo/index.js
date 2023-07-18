//  INCLUDE EXPRESS
const Jois = require('joi');
const express = require('express');
const app = express();
app.use(express.json());


const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'},
];

//  GET REQUESTS
app.get('/', (req,res) => {

    res.send('Hello World!!!');

});

app.get('/api/courses', (req,res) => {
    res.send(courses);
});

app.get('/api/courses/:id',(req,res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found') //404
    res.send(course);
});

// app.get('/api/posts/:year/:month',(req,res) => {
//     res.send(req.params);
// });

// app.get('/api/posts/:year/:month',(req,res) =>{
//     res.send(req.query);
// });

//  POST REQUESTS
app.post('/api/courses',(req,res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

//  PUT REQUESTS
app.put('/api/courses/:id',(req,res) => {
    //Look up the course
    //If not existing, return 404
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if(!course) return  res.status(404).send('The course with the given ID was not found') //404
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Update course
    course.name = req.body.name;
    //Return the updated course
    res.send(course);
});


function validateCourse(course){
    const schema = {
        name: Jois.string().min(3).required()
    }

    return Jois.validate(course, schema);
}

//  DELETE REQUESTS
app.delete('/api/courses/:id',(req,res) => {
    //Look up the course
    //No existing, return 404
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found')

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return the same course
    res.send(course); 
});


//  PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));