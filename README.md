# Authentication and Authorization system
## Description
### Features
- service is responsible for authenticate and login users
- service is responsible for validating whether logged user is permitted to do specific action or not
- service is responsible for logging users out from the system

### Considerations
Here is the points that first come to my mind after some thinking and searching and you will find some resources that will help you to take a decision.
- Sessions vs. Jwt
- MongoDB vs Redis for storing user sessions
- Best way to maintain user session
- express-session & passport session

For me I decided to:
- Use sessions for user authentication as It is more secure and easier to invalidate than jwt.
- MongoDb for storing user sessions, I'm neutral here but as I'll use mongo in storing data generally it will easier to integrate and better for saving time.
- Using express-session and passport session along with each other ... firstly I thought that they are competitors but later I found out that they complete each other.

## How to run

### With docker
1. Just install docker
1. Run `npm run docker` in the root folder

### Without docker
#### Requirements
- Mongo server installed
- Node js installed

#### Setups
just run `npm i` then `npm start` and here you go.


## Technical
### Integrated packages
- Eslint: for better coding style all over the project
- Jest: for testing purposes
- Swagger: for exposed APIs docs
- Docker: to run regardless the environment 

### ER diagram


## Future work
- Integrating jsDocs also will be better.


## Useful links
- https://www.javatpoint.com/session-vs-cookies
- https://www.npmjs.com/package/express-session
- **https://developer.okta.com/blog/2021/06/07/session-mgmt-node**
- https://blog.jscrambler.com/best-practices-for-secure-session-management-in-node
- https://stackoverflow.com/questions/27010013/express-session-vs-passportjs-session
- https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
- https://blog.bitsrc.io/authentication-work-flow-using-express-session-and-passportjs-4291231285a5
- https://stackoverflow.com/questions/22888617/mongodb-vs-redis-for-user-sessions
