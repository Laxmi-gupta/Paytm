import express from "express";
import crypto from "crypto";
import axios from "axios";

const app = express();
app.use(express.json());   // if we need access req.body we need to convert it in json
app.use(express.urlencoded({ extended: true }));

const payment = {};
// ye bank ka
app.post('/bank/make-payment',async(req,res) => {
  const {userId, amount} = req.body;     
  if(!userId || !amount) {
    return res.json({message: "Invalid input"});
  }

  const token = crypto.randomBytes(32).toString('hex');
  // bhot sare payemnts ho sakte h na like 50 ,100 ek baar mai to har payemnt ka alag token mai store hoga
  payment[token] = {
    userId,amount,status:"pending"
  } 
  res.json({token,paymentUrl: `http://localhost:3001/bank/pay?token=${token}`})  // to bank ke page mai bank ke url ko call karu

});


app.get('/bank/pay',(req,res) => {
  const token = req.query.token;
  if(!token) return Send.error(res,null,"Token not found");
  // react page render
  res.send(`
   <html>
      <body style="font-family: Arial; max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc;">
         <form method="POST" action="/bank/pay/complete?token=${token}">
            <button type="submit" style="background: green; color: white; padding: 10px;">
                Complete Payment
            </button>
        </form>

        <!-- Cancel Form -->
        <form method="POST" action="/bank/pay/cancel?token=${token}" style="margin-top: 20px;">
            <button type="submit" style="background: red; color: white; padding: 10px;">
                Cancel Payment
            </button>
        </form>

      </body>
    </html>  
  `)
})

app.post('/bank/pay/complete',async(req,res) => {
  const token = req.query.token;
  console.log("trans complete token",token)
  const {userId,amount} = payment[token];
  if(!payment[token]) return res.json({message:"Token invalid"});
  payment[token].status="success";
  const webhook  = await axios.post('http://localhost:3002/webhooks',{token,userId,amount});
  console.log("webhook",webhook);
  return res.status(200).json({data:payment});  // updated wala ayega
})

app.post('/bank/pay/cancel',(req,res) => {
  const token=req.query.token;
  if(!payment[token]) return res.json({message:"Token invalid"});
  payment[token].status = "failed";
  return res.status(400).json({data:payment})
})

app.listen(3001,() => {
  console.log("app listienng 3001")
})