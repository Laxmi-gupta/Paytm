import express from "express";
import crypto from "crypto";
import axios from "axios";

const app = express();
app.use(express.json());   // if we need access req.body we need to convert it in json
app.use(express.urlencoded({ extended: true }));

const payment = {};
// ye bank ka
app.post('/bank/make-payment',async(req,res) => {
  const {userId, amount,provider} = req.body;     
  if(!userId || !amount || !provider) {
    return res.json({message: "Invalid input"});
  }

  const token = crypto.randomBytes(32).toString('hex');
  // bhot sare payemnts ho sakte h na like 50 ,100 ek baar mai to har payemnt ka alag token mai store hoga
  payment[token] = {
    userId,amount,provider,status:"pending"
  } 
  res.json({token,paymentUrl: `http://localhost:3001/bank/pay?token=${token}`})  // to bank ke page mai bank ke url ko call karu

});


app.get('/bank/pay',(req,res) => {
  const token = req.query.token;
  console.log("payment page",token)
  console.log("payment success",payment[token]);
  if(!token) return Send.error(res,null,"Token not found");
  
  res.send(`
   <html>
      <head>
        <style>
          body {
            display:flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f2f4f7
          }

            .container {
              width: 380px;
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.15);
              padding: 25px;
              text-align: center;
            }

          .bank{
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #1e40af;
          }

          .amount-box {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }

          .amount {
            font-size: 26px;
            font-weight: bold;
            margin: 20px 0;
            color: #111;
          }

           button {
            width: 100%;
            padding: 14px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            margin-top: 10px;
            display: inline;
          }

          .pay-btn {
           width: 100%;
            padding: 10px 14px;
            border-radius: 8px;
            border: none;
            background: #0f172a;
            color: white;
            font-weight: 600;
            cursor: pointer;
          }
          

          .pay-btn:hover {
            background: #15803d;
          }

          .cancel-btn {
            width: 100%;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            background: white;
            color: #111827;
            font-weight: 600;
            cursor: pointer;
          }

          .btn-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-top: 20px;
          }

          .btn-row form {
            flex: 1;
          }

          .footer {
            margin-top: 15px;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="bank">${payment[token].provider}</div>

          <div class="amount-box">
            <div>You are paying</div>
            <div class="amount">Amount: ₹ ${payment[token].amount}</div>
          </div>

          <div class="btn-row">
            <form method="POST" action="/bank/pay/complete?token=${token}">
                <button type="submit" class="pay-btn" >
                    Complete Payment
                </button>
            </form>

          
            <form method="POST" action="/bank/pay/cancel?token=${token}">
                <button type="submit" class="cancel-btn">
                    Cancel Payment
                </button>
            </form>
          </div>

          <div class="footer">Powered by ${payment[token].provider}</div>
        </div>
      </body>
    </html>  
  `)
})

app.post('/bank/pay/complete',async(req,res) => {

  try {
    const token = req.query.token;
    console.log("bank toke",token)
    if(!token || !payment[token]) return res.json({message:"Token invalid"});
    const {userId,amount} = payment[token];
    payment[token].status="success";
    console.log("calling webhooko")
    const webhook  = await axios.post('http://localhost:3000/webhooks',{token,userId,amount});
    // console.log("webhook",webhook); 
    res.redirect(`http://localhost:5173/success-payment?token=${token}`);
  } catch(error) {
    console.error("Payment failed",error);
    return res.status(500).json({data:payment});
  }
})

app.post('/bank/pay/cancel',(req,res) => {
  const token=req.query.token;
  if(!token || !payment[token]) return res.json({message:"Token invalid"});
  payment[token].status = "failed";
  return res.status(400).json({data:payment})  // iske wajah se wo 3001 oe h
})

app.listen(3001,() => {
  console.log("app listienng 3001")
})