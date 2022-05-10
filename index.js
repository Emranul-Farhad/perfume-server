const express = require('express')
const app = express()
var jwt = require('jsonwebtoken');
const port = process.env.PORT || 8000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
var cors = require('cors');
const res = require('express/lib/response');
const decode = require('jsonwebtoken/decode');


// 
app.use(cors())
app.use(express.json())
// 


// jwt verify

// function jwtverify(req,res,next){
//   const header = req.headers.authorization
//   if(!header){
//     return res.status(401).send({message: "unauthorized access"})
//   }
  
//   next()

// }



function jwtverifys(req, res, next){
  const tokenheader = req.headers.authorization;
  if(!tokenheader){
    return res.status(401).send({message : "unauthorized access"})
  }
  const splitoken = tokenheader.split(' ')[1]
  jwt.verify(splitoken, process.env.ACCESS_TOKEN , (err, decoded) => {
    if(err){
      return res.status(403).send({message: "fobidden access"})
    }
    console.log(decoded);
    req.decoded = decoded
  } )

  next()
}

// mongo db connection 

const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD_KEY}@cluster0.of4tk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

  try {
    await client.connect()
    const collection = client.db("perfume").collection("products");

// jwt
     app.post('/login' ,async(req,res) => {
       const users = req.body;
       const accessToken = jwt.sign(users, process.env.ACCESS_TOKEN,{
         expiresIn : '6d'
       })
       res.send({accessToken});
     })
      


    app.get('/products',  async (req, res) => {
      const query = {}
      const cursor = collection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/myitem', jwtverifys, async(req, res) => {
      const decodemial = req.decoded.Email
       const email = req.query.email;
       if(decodemial === email){
        const query = {email:email}
        const cursor = collection.find(query)
        const result = await cursor.toArray()
        res.send(result)
       }
       else{
         res.status(403).send({message : 'forviden'})
       }
      
       
     
    
    })


    app.post('/product', async (req, res) => {
      const id = req.body;
      const result = await collection.insertOne(id)
      res.send(result)
    })


    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singelid = await collection.findOne(query)
      res.send(singelid)
    })

    app.get('/productupdate/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await collection.findOne(query)
      const option = { upsert: true }
      const updated = { $set: { ...product, quantity: +product.quantity - 1 } }
      const result = await collection.updateOne(query, updated, option)
      res.send(result)
    })



    // products update

    app.post('/update/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const plus = req.body.quantity
      const options = { upsert: true }
      const product = await collection.findOne(query)
      const updatedDoc = { $set: { ...product, quantity: +product.quantity + plus } }
      const result = await collection.updateOne(
        query,
        updatedDoc,
        options
      )
      res.send(result)
    })


// products deleted

    app.delete('/product?:id' , async(req,res)=> {
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const deleted = await collection.deleteOne(query)
      res.send(deleted)
    } )



  }

  finally {

  }

}

run().catch(console.dir);


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log("connected mongo");
//   // perform actions on the collection object
//   client.close();
// });






app.get('/', (req, res) => {
  res.send('fashions Time')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})