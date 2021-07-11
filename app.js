const e = require('express')
const express = require('express')
const app = express()
const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'google-registeration',
})
db.connect((error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log('Database connected...')
    }
})

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
// app.use('/auth', require('./routes/auth'))
app.use('/public', express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})
app.get('/registeration', (req, res) => {
    res.sendFile(__dirname + "/registration.html")
})

app.post('/register', (req, res) => {
    console.log(req.body);
    // const { name, email, password, confirmPassword } = req.body;
    db.query('SELECT email FROM users WHERE email=?', req.body.email, (error, result) => {
        if (error) {
            console.log(error);
        }
        if (result.length > 0) {
            return res.send('<center><h1>Email already exists..</h1></center>')
        }
        if (req.body.confirmPassword == req.body.password) {

            res.send('<center><h1>FORM SUBMITTED...</h1></center>')
            var sql = 'insert into users values(?)';
            var value = [null, `${req.body.email}`, `${req.body.password}`, `${req.body.confirmPassword}`];
            db.query(sql, [value], (error, result) => {
                if (error) {
                    console.log(error)
                }
                else {

                    console.log('Entry Successfull.')
                }

            })
        }
        if (req.body.confirmPassword != req.body.password) {
            res.send('<center><h1>Password not matched</h1></center>')

        }
    })

})

app.post('/login', (req, res)=>{
    console.log(req.body);
    if(req.body.email && req.body.password){
        db.query('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.email, req.body.password], (error, results)=>{
            if(error){
                throw error;
            }
            if (results.length > 0) {
				// req.session.loggedin = true;
				// req.session.username = username;
				res.redirect('/');
			} else {
				res.send('<center><h1>Incorrect Username and/or Password!</h1></center>');
			}			
			res.end();
        })
    }
})

app.listen(3000, () => {
    console.log('Server running at port 3000...')
})