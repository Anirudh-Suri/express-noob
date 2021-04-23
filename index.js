const Joi=require('joi'); //class Joi 

const express=require('express');  //loading express module
const app=express();   //returns object of type express

app.use(express.json());  //adding a piece of middleware to use that middleware in the request processing pipeline

const courses=[           //array of courses object
 {id:1,name:'eng'},
 {id:2,name:'hindi'},
 {id:3,name:'math'},
];

//''''''''Routes for responding HTTP Get Requests''''''''''''//
app.get('/',(req,res)=>{
 res.send('hello world!!!!');
});

app.get('/api/courses',(req,res)=>{
 res.send(courses);
});
app.get('/api/courses/:id',(req,res)=> { 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('the course with given id was not found');  //404 object not found
    res.send(course);
});
// // /api/course/1   ROUTE PARAMETERS
// app.get('/api/posts/:year/:month',(req,res)=>{
//  res.send(req.params);
// });
// //QUERY STRING PARAMETERS
// app.get('/api/posts/:year/:month',(req,res)=>{
//     res.send(req.query);
//  });




/////''''''HostingPostRequests'''''///////////
app.post('/api/courses',(req,res)=>{   
                  
                ////+++NO NEED TO USE THIS CODE USE ALTERNATE METHOD++++/////
    // const schema ={    //define schema which defines shape of an object, properites,types of object
    //  name: Joi.string().min(3).required()  //Joi makes it easy to validate the input and return proper error messgaes to the client
    // };
    // const result=Joi.validate(req.body,schema);

    // if(result.error){     //data validation
    //  res.status(400).send(result.error.details[0].message);   //400 bad request
    //  return;  // we return here bcse we don't want rest of this fn. to be executes
    // }


              ////++++++++++++ALTERNATE  METHOD+++++++++++++//////////
              const {error}=validateCourse(req.body);     //objext destructuring  //equivalent to result.error
            if(error){     //data validation
                res.status(400).send(error.details[0].message);   //400 bad request
               return;  
            }

   const course = {
        id: courses.length +1,  // assigning id to server
        name: req.body.name,
    };
    courses.push(course);
    res.send(course); //when we post an object to server i.e. when server creates new object it should retuen onject in body of response
});
 





////''''HandlingPutRequests'''''///////
app.put('/api/courses/:id',(req,res)=>{
    //look up the course
  //if not existing , return 404 i.e. resource not found
  const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send('the course with given id was not found');
        return;   //bug fixed with return keyword i.e if no course return from this fn. immediately
    }

  //validate the code
  //if invalid, return 400 i.e. bad request
   const {error}=validateCourse(req.body);     //objext destructuring  //equivalent to result.error

   if(error){     //data validation
     res.status(400).send(error.details[0].message);   //400 bad request
    return;  
   }

  //update course
  course.name=req.body.name;
  //return the updated course to the client
  res.send(course);
});





        /////''''HTTP DELETE REQUEST'''''///////
    app.delete('/api/courses/:id',(req,res)=>{
      //look up course
      //not existing, return 404
      const course = courses.find(c => c.id === parseInt(req.params.id));
      if(!course) return res.status(404).send('the course with given id was not found');

      //delete
     const index=courses.indexOf(course);
     courses.splice(index,1);
      
    //return the same course
     res.send(course); 
    });





//''''VALIDATION LOGIC IN ONE PLACE SO THAT WE CAN RESUE IT IN REQUESTS
function validateCourse(course){   
    const schema ={    //define schema which defines shape of an object, properites,types of object
        name: Joi.string().min(3).required()  //Joi makes it easy to validate the input and return proper error messgaes to the client
    };
        return Joi.validate(course,schema);  //return the result to the caller

}





    


//PORT instead of using 3000 which is arbitary no. USE dynamic value (export PORT 'anyPortNo.') in terminal
const port = process.env.PORT || 3000;       //ENVIRONMENT VARIABLE


app.listen(port,()=>console.log(`listening on port ${port}....`));
