import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express application
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Gets cars. Optionaly filtered by make
  app.get("/cars", async (req: Request, res: Response) => {
    const { make } = req.query;

    const filteredCars = make
      ? cars.filter(c => c.make.toLowerCase() == (<string>make).toLowerCase())
      : cars;

    return res
      .status(200)
      .send(filteredCars);
  });

  // Gets car by id 
  app.get("/cars/:carId", async (req: Request, res: Response) => {
    const { carId } = req.params;

    
    const parsedCarId = +carId;
    
    if (parsedCarId < 0 || isNaN(parsedCarId) || !!(parsedCarId % 1)) {
      return res
        .status(400)
        .send("wrong carId format!")
    }

    const car = cars.find(c => c.id === +carId);
    
    if (!car) {
      return res
        .status(404)
        .send("car not found!");
    }
    
    return res
      .status(200)
      .send(car);
  });


  // Adds new car
  app.post("/cars", async (req: Request, res: Response) => {
    const { type, make, model, cost } = req.body;

    const validationErrors: string[] = [];

    if (!type) {
      validationErrors.push("type is required");
    }

    if (!make) {
      validationErrors.push("make is required");
    }

    if (!model) {
      validationErrors.push("model is required");
    }

    let parsedCost;
    if (!cost) {
      validationErrors.push("cost is required");
    } else {
      parsedCost = +cost;
  
      if (parsedCost < 0 || isNaN(parsedCost)) {
        validationErrors.push("cost have to be positive number");
      }
    }

    if (validationErrors.length > 0) {
      return res
        .status(400)
        .send({ validationErrors });
    }

    const id = Math.max(...cars.map(c => c.id)) + 1;

    console.log(id);

    cars.push({
      id,
      type,
      make,
      model,
      cost: parsedCost
    });

    return res
      .status(201)
      .send(id.toString());
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
