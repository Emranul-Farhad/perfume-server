const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
var cors = require('cors')



app.use(cors())
app.use(express())
// 





const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD_KEY}@cluster0.of4tk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log("connected mongo");
//   // perform actions on the collection object
//   client.close();
// });






app.get('/', (req, res) => {
  res.send('Hello Worlaaad!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})