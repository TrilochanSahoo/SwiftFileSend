import express,{Express} from 'express'
// import bodyParser from 'body-parser'
import qr from 'qrcode'
// import cors from 'cors'

const cors = require('cors');
const bodyParser = require('body-parser');

const app:Express = express()


app.use(cors({
    origin: process.env.Frontend_URL, // Frontend running locally on port 3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // If using cookies or authentication
  }));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/v1/generateQrcode',(req,res)=>{
    const qrContent = req.body.content
    console.log(qrContent)
    if(qrContent.length ===0){
        res.status(500)
        res.send("Empty content found.")
    }
    qr.toDataURL(qrContent,(err,src)=>{
        if(err){
            res.status(404)
            res.send("error occured")
        }
        else{
            res.status(200)
            res.json({
                src : src
            })
        }
    })
})

export default app
