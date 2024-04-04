const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());





const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vivchso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const serviceCollection = client.db('carDoctor').collection('service')
    const checkoutCollection = client.db('carDoctor').collection('cheskOut')
    //to find all of the service 
    app.get('/service' , async(req , res)=>{
        const query = {}
        const cursor = serviceCollection.find(query)
        const result = await cursor.toArray()
        res.send(result)
    })
    //to find one id details in the service
    app.get('/service/:id' , async(req , res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await serviceCollection.findOne(query)
        // const result = await cursor.toArray()
        res.send(result)
    })

    //post the cheakOut information
    app.post('/cheakout' , async(req , res)=>{
        const information = req.body;
        const result = await checkoutCollection.insertOne(information)
        res.send(result)
    })

    //get the orders details by the specific email 
    app.get('/cheakout', async(req , res)=>{
      let query = {}
      if(req.query.email){
        query={
          email : req.query.email
        }
      }
      const cursor = checkoutCollection.find(query)
      const result = await cursor.toArray();
      res.send(result)
    })
    app.patch('/cheakout/:id' ,async(req , res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const status = req.body.status;
      const updateDoc = {
        $set :{
          status : status
        }
      }
      const result = await checkoutCollection.updateOne(filter ,updateDoc)
      res.send(result)
    })
    
    //delete the orders items by there id 
    app.delete('/cheakout/:id' , async(req , res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await checkoutCollection.deleteOne(query)
        res.send(result)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/' , (req , res)=>{
    res.send('hello from mongodb')
})
app.listen(port , ()=>{
    console.log(`Listening port running in ${port}`)
})



