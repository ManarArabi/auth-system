# Authentication and Authorization system
## Description
### Use cases
- Sign up and authenticating users
- Log users out from the system
- Adding permissions
- Adding roles with certain permissions
- Updating roles permissions
- Adding actions with certain permissions
- Updating actions permissions
- Assigning role to certain user 
- Validating whether logged user is permitted to do specific action or not

### Considerations
Here is the points that first come to my mind after some thinking and searching and you will find some resources that will help you to take a decision.
- Sessions vs. Jwt
- MongoDB vs Redis for storing user sessions
- Best way to maintain user session
- express-session & passport session

For me I decided to:
- Use jwt for user authentication as It is simple and easier to implement.
- To save jwt in the users collection to log the user out by deleting it.

### Thinking process

#### System design

- Firstly, I was thinking of something more simple consist of only users and roles but after 2 days of thinking and initial planning/implementation I found that, we can't check user action authorization unless this action is implemented in the code and this is not extendable.

- So, The idea of saving actions as constant strings in data base came from here ... the system will have as many actions as the consumer need and could be integrated as auth system with any other working system.

- Although this idea means more work and much more endpoints :joy: but it was the best and optimum I have in my mind

- The system now has the basic target endpoints to start with but working with it in this case will require listing the actions, role, permissions, and users listing from data base for now until their endpoints is implemented.

#### Testing
- I tried as much as I could to test everything but it seems somehow that every file passes when I run it separated from the others ... making email, actions, permissions, and roles uniq messes them when I run them all together.

#### Authentication
- Firstly, I was thinking to implement the authentication with sessions as it is more secure ... but decided to use jwt as it is more simple and will do the job well.

## How to run

### With docker
1. Just install docker
1. Run `npm run docker` in the root folder
1. init `.env` file and please note that if you will use a local db, it should be something like this `mongodb://mongo:27017/user-auth-system`

### Without docker
#### Requirements
- Mongo server installed
- Node js installed

#### Setups
just run `npm i`, add `.env` file ... then `npm start` and here you go.

## Technical
### Integrated tools/packages
- Eslint: for better coding style all over the project
- Jest: for testing purposes
- Swagger: for exposed APIs docs
- Docker: to run regardless the environment 

## Project details
### ER diagram
I wanted the authorization to be extendible ... not dependant on actions implemented in the code.
This design will allow the user to add as many actions as he like and assign their permissions to roles and users also easily.

Permissions are denormalized in users schema here as the authorize will be used in real systems more than updating a role/action permissions

![ER](er-diagram.png)

### Work flow
- Running the project for the first time will seed the database with basic roles, permissions and admin user ... throw these seeds you can execute any endpoint that need admin to call it (add new role/permission/action)

- If it is not the first time to run it, everything will be as it is ... it will only the missing seeds.

- Setting admin mail and password in the `.env` file, will create an admin with these data on the startup and if there is already admin with the provided mail, it will reset his password with the provided password.

### APIs
- After running the project you can find the endpoint docs at `localhost:<port-number>/docs`

## Future work
- Adding endpoints to facilitate the work flow:
  - listing roles with their permissions
  - listing actions with their permissions
  - listing user with his permissions
- Revisiting authentication layer to make it more robust and using passport
- Seeding basic actions to the system on project startup.
- Implement the same logic with sessions

## Useful
[Exploring difference between sessions, cookie, and jwt is really insightful](https://developer.okta.com/blog/2021/06/07/session-mgmt-node)


[Secure session management](https://blog.jscrambler.com/best-practices-for-secure-session-management-in-node)


[Using passport with sessions](https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive)
