const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient, ObjectId } = require('mongodb')
const { countComment } = require('./constants/utils.js')

require('dotenv').config() // how to import the .env file

var db, collection;

const url = process.env.URL
const dbName = process.env.DBNAME

app.listen(5000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('tasksToDo').find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log(result)
    console.log(`count comment: ${countComment}`)
    res.render('index.ejs', {
      tasksLeft: result,
      // ttlLeftToDo: result.filter(task => !task.completed).length,
      countMessage: countComment(result)//got this from utils folder

    })
  })
})

app.post('/tasksLeftToDo', (req, res) => {
  const { tasksLeft, completed } = req.body
  console.log(req.body)
  db.collection('tasksToDo').insertOne({ tasksLeft, completed }, (err, result) => {
    if (err) return console.log(err)
    console.log(`ops array: ${result.ops}`)
    console.log(`ops object key: ${result.ops[0].tasksLeft}`)
    console.log(`ops index 0: ${result.ops[0]}`)
    console.log(`ops object key: ${result.ops[0]._id}`)

    db.collection('tasksToDo').find({ completed: false }).toArray((err, tasks) => {
      if (err) return console.log(err)
      res.send({
        tasksLeft: tasks,
        newTask: result.ops[0]
      })
    })

    //[{tasksLeft:'walk'}] ops = [] array, ops[0] = {taksLeft:'walk'} object, ops[0].tasksLeft = walk returns value
    // res.send(result.ops[0])
    // went into results which is a big pbject and found the key ops with a value in an array with the task we're looking for which is tasksleft, we found this by consolelogging line 45
  })
})

app.put('/tasksLeftToDo', (req, res) => {
  console.log(req.body)
  const { completed, id } = req.body
  console.log(id)
  db.collection('tasksToDo')
    .findOneAndUpdate({ "_id": ObjectId(id) }, {
      $set: {
        completed
      }
    }, {
      returnOriginal: false
    }, (err, result) => {
      if (err) return res.send(err)
      console.log(result)
      db.collection('tasksToDo').find({ completed: false }).toArray((err, tasks) => {
        if (err) return console.log(err)
        res.send({
          tasksLeft: tasks,
          result
        })
      })
    })
})

app.delete('/tasksLeftToDo', (req, res) => {
  const { ids } = req.body
  db.collection('tasksToDo').deleteMany({ _id: { $in: ids.map(id => ObjectId(id)) } }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('task deleted!')
  })
})
