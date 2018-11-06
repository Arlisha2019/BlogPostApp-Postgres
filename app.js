const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()
const pgp = require('pg-promise')()
const port = 3000



function dateTimeNow() {
 var dateTime = new Date().toLocaleString()
 return dateTime
}

app.use(express.static('css'))

app.use(bodyParser.urlencoded({ extended: false }))

const connectionString = "postgres://localhost:5432/blogapp"

const db = pgp(connectionString)

app.engine('mustache',mustacheExpress())
app.set('views','./index')
app.set('view engine','mustache')

app.get('/input-post', function(req, res){
  res.render('input-post')
})

app.get('/input-post/all-post/', function(req, res){
  res.render('all-post')
})

app.post('/all-post', function(req, res) {

  let currentDate = dateTimeNow()

  let category = req.body.category
  let title = req.body.title
  let date = currentDate
  let body = req.body.body

  db.none('INSERT INTO posts(category,title,date,body) VALUES($1,$2,$3,$4)', [category,title,date,body])
  .then(function(){
    res.redirect('/all-post')
  })
  .catch(function(error){
    console.log(error)
  })
})

app.post('/delete-post', function(req, res) {
  let postid = req.body.postid

  db.none('DELETE FROM posts WHERE postid = $1;', [postid])
  .then(function(){
    res.redirect('/all-post')
  })
  .catch(function(error) {
    console.log(error)
  })
})

app.get('/all-post', function(req,res) {


db.any('SELECT postid,category,title,date,body from posts;')
  .then(function(result){
    console.log(result);
    res.render('all-post', {posts: result})
  })
})

app.listen(port, function(req, res) {
  console.log("Let's Start Coding Again....");
})
