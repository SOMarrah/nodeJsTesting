## Setup

```bash
$ brew upgrade #make sure current brew is up to date
$ brew install postgresql #install postgresql
$ which psql #make sure postgresql installed correctly
$ cd <directory> #cd into your project directory
$ npm init #initialize a npm project
$ brew services start postgresql #start postgresql
$ psql -U postgres #create a postgres user - this will be for pgadmin4
$ psql postgres #enter the postgres command line
  ```

interacting with the postgresql database before using pgadmin4 was a little tricky - try to avoid my mistakes of making multiple users (postgres is a required user for pgadmin4)

i could have probably renamed the database from postgres to something more specific; I will keep that in mind for the future

```postgres
CREATE DATABASE postgres OWNER postgres;<!-- this creates a postgres database with the owner of postgres  -->
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;<!-- this grants all privileges of the user postgres to the database postgres -->
CREATE TABLE users (username text, email text, number_apps integer, most_app_time integer, least_app_time integer); <!-- this creates a user table in the postgres database -->
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres; <!-- give all permissions on tables to postgres -->
exit <!-- exits the postgres command line-->
```

next install express and pg

```bash
npm i express pg
```

create an index.js file

create a queries.js file


### index.js

the following variables and requirements to run the server:
```js
const express = require('express') //use the express module
const bodyParser = require('body-parser') //use the body-perser node module
const app = express() //start the express server
const port = 3000 //define the port your server will be running on
const db = require('./queries') //db uses the queries.js file and accesses the api endpoints
```
```js
app.use(bodyParser.json()) //use app uses bodyparser to convert to json
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
//the home page to be displayed - this is useful to check if your server is running.
app.get('/', (request, response)=>{
    response.json({info: 'Node.js, Express, and Postgres API'})
})
//listen on the defined port - log it into the console. this creates and returns a http server using node
app.listen(port, ()=>{
    console.log(`App running on port ${port}`)
})

```
### queries.js

```js
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'OMarrah213!@',
    port: 5432
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users', (error, results)=>{
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const {username, email, number_apps, most_app_time, least_app_time} = request.body

    pool.query('INSERT INTO users (username, email, number_apps, most_app_time, least_app_time) VALUES ($1,$2,$3,$4,$5) RETURNING *', [username, email, number_apps, most_app_time, least_app_time], (error, results)=>{
        if(error){
            throw error
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
}

module.exports = {
    getUsers,
    createUser,
}
```