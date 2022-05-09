const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
var cors = require('cors');
const res = require('express/lib/response');


// 
app.use(cors())
app.use(express.json())
// 



// mongo db connection 

const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASSWORD_KEY}@cluster0.of4tk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

  try{
    await client.connect()
    const collection = client.db("perfume").collection("products");

    app.get('/products' , async(req,res)=> {
      const query = {}
      const cursor = collection.find(query).limit(6)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/product' , async(req,res)=> {
      const query = {}
      const cursor = collection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    }) 

    app.get('/product/:id' , async(req,res)=> {
      const id = req.params.id;
      const query= {_id: ObjectId(id)};
      const singelid = await collection.findOne(query)
      res.send(singelid)
    } )

    app.get('/productupdate/:id' , async(req,res)=>{
      const id = req.params.id;
      const query= {_id: ObjectId(id)};
      const product = await collection.findOne(query)
  
      const option = {upsert:true}
      const updated = {$set:{...product, quantity: +product.quantity-1}}
      const result = await collection.updateOne(query,updated,option)
      res.send(result) 
    } )



// products update

      app.post('/update/:id' , async(req,res)=> {
        console.log("ffgffg");
        const id = req.params.id
			const query = { _id: ObjectId(id)}
     const plus = req.body.quantity
     console.log(plus);
			const options = { upsert: true }
			const product = await collection.findOne(query)
      console.log(product);
      const updatedDoc = {$set:{...product, quantity: +product.quantity + plus}}
			const result = await collection.updateOne(
				query,
				updatedDoc,
				options
			)
			res.send(result)
      } )



   
     
  }

  finally{

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
  res.send('Hello Worlaaad!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})