import bodyParser from "body-parser";
import express from "express";
import { deleteLocalFiles, filterImageFromURL } from "./util/util";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Process image
  app.get("/filteredimage", async (req, res) => {
    const imageUrl: string = req.query["image_url"];

    if (!imageUrl) {
      return res
        .status(400)
        .send("image_url is required.");
    }

    const imagePath = await filterImageFromURL(imageUrl);
    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error(err.message);
      }
      deleteLocalFiles([ imagePath ]);
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}");
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
