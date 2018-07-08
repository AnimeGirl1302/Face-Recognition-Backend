const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : '#idgafay8',
        database : 'smartbrain'
  }
});

db.select('*').from('users').then(data => {
 console.log(data);
});

app.use(bodyParser.json());
app.use(cors());

app.post('/signin', (req, res) => {
   db.select('email', 'hash').from('login')
   .where('email', '=' , req.body.email)
   .then(data => {
       const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
       if(isValid){
           return db.select('*').from('users')
           .where('email', '=' , req.body.email)
           .then(user => {
               console.log(user);
               res.json(user[0])
           })
           .catch(err => res.status(400).json('unable to get user'))
       }
       else{
           res.status(400).json('Wrong Credentials')
       }
   })
    .catch(err => res.status(400).json('Wrong Credentials'))
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
    
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
             name : name,
             email: loginEmail[0],
             joined: new Date()
           })
           .then(user => {
               res.json(user[0]);
           })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })


//     bcrypt.compareSync(myPlaintextPassword, hash); // true
// bcrypt.compareSync(someOtherPlaintextPassword, hash); // false

   
   .catch(err => res.status(400).json('unabe to register'));
   
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        if(user.length){
            res.json(user[0]);
        }
        else{
            res.status(400).json('Not found')
        }
    })
    .catch(err => res.status(400).json('Unable to get teh user'));

    // if (!found) {
    //     res.status(400).json('id does not exist');
    // }
})

app.put('/image', (req, res) =>{
    const { id } = req.body;
    db('users').where('id' , '=' , id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
})



// Load hash from your password DB.
//bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
// res == true
//});
//bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
// res == false
//});

app.listen(3000, () => {
    console.log('its working');
})

/*
/ --> res = this is woring
/signin --> POST success or fail
/register --> add data to database --> POST = new user object 
/profile/:userId --> GET  = user
/image --> PUT(updating ) --> return updated user object 
*/

/*bcrypt.hash(password, null, null, function(err, hash) {

    console.log(hash);
});
*/