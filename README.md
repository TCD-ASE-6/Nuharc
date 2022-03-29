# Nuharc  

## Important
convert class components to functional components (https://nimblewebdeveloper.com/blog/convert-react-class-to-function-component)

create your development cluster on mongodb atlas and add the db uri under config/keys.js (devMongoURI) before proceeding.  
Install React and Redux Extensions on your browsers.  
The UI can be found under the Client folder.  
Mongoose Models go under the models folder.  
Node endpoints go under the routes folder.  

#### Scripts
__npm run server__, to run just the development server.  
__npm run client__, to run just the client.  
__npm run dev__, to run both the client and the server concurrently on dev.  
__npm run prod__, to run both the client and the server concurrently on dev.  

If there is a port conflict, config the port in server.js.  

#### Group Account for mongodb prod env

__email__: tcdase6@gmail.com  
__password__: trinityase6  


To run Integration tests using cypress,

TODO: Disable redux dev tools extension in store.js before running integration tests. you might encounter b is undefined error, if this is enabled.
cd into client, run npx cypress open
