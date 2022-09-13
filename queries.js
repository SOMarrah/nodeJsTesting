const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '',
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
// Get full CRUD: by ID; Update; Delete users

module.exports = {
    getUsers,
    createUser,
}