# Nuharc  
```
The goal of this project is to develop an application that simulates responses to disasters in Dublin city. The application uses a map to show traffic information in real time (i.e., cars and buses moving around the city) based on actual Dublin city data sources such as bus and traffic information.
A disaster can be reported at any location of the city, and the response should re-route traffic to avoid roads blocked by the disaster; send emergency vehicles such as ambulances to help affected people; and plan evacuation routes that people must follow to be safe, including (but not restricted to) deployment of additional means of transport – e.g., buses – where possible. Disasters can emerge as a result of natural phenomena such as a river flooding, or human activities such as a fire in a stadium at the time of a concert.
```

## The Team

| College ID  | Surname  | First Name | Mail ID | Github Handle
| :--------:    |:---------------:| :------:| :--------------: | :--------------: |
| 20303676      | Mudigonda          | Sai Kaushik  |  mudigons@tcd.ie  | [msaikaushik](https://github.com/msaikaushik), [faheimarslan](http://github.com/faheim-arslan)
| 20301672      | Borole          | Bhushan   |  boroleb@tcd.ie | [bhushan-borole](https://github.com/bhushan-borole)
| 20305836      | Kraus | Oliver     | krauso@tcd.ie | [OvrK-tcd](https://github.com/OvrK-tcd)
| 20335040 	    | Singh 	        | Rajpal | singhr3@tcd.ie  | [Rajpal02](https://github.com/Rajpal02)
| 21334470 	    | Sharma 	        | Ritika  | sharmari@tcd.ie    | [ritika24-s](https://github.com/ritika24-s)
| 19303325 	    | Uniyal 	    | Shubham | uniyals@tcd.ie  | [shubham93](https://github.com/shubham93)
| 20302472 	    | Arslan 	    | Tolga | arslant@tcd.ie  | [arslant-tcd](https://github.com/arslant-tcd)
| 21330894 	    | Shukla 	    | Yash | yshukla@tcd.ie  | [yashshukla025](https://github.com/yashshukla025)


#### It is highly Available.

#### Provides low latency.

#### Is Flexible. 


### Project Installation and Setup

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

![Noah's Arc](./assets/arc.jpg "Noah's Arc")