import express from "express";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());   // if we need access req.body we need to convert it in json
app.use(express.urlencoded({ extended: true }));

const payment = {};
app.post('/bank/make-payment',async(req,res) => {
  const {userId, amount,provider} = req.body;     
  if(!userId || !amount || !provider) {
    return res.json({message: "Invalid input"});
  }

  const token = crypto.randomBytes(32).toString('hex');
  payment[token] = {
    userId,amount,provider,status:"pending"
  } 
  res.json({token,paymentUrl: `${process.env.BANK_BASE_URL}/bank/pay?token=${token}`}) 

});


app.get('/bank/pay',(req,res) => {
  const token = req.query.token;
  if(!token) return Send.error(res,null,"Token not found");
  
  res.send(`
   <html>
      <head>
        <style>
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
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
              border: 1px solid #e2e8f0;
            }

            .amount-box p {
              margin: 0;
              color: #64748b;
              font-size: 14px;
            }

            .amount {
              font-size: 26px;
              font-weight: bold;
              margin-top: 10px;
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
              transition: all 0.2s ease;
            }
                      
            .btn-row {
              display: flex;
              gap: 15px;
            }

            .btn-row form {
              flex: 1;
            }

            .pay-btn {
              background: #15803d;
              color: white;
              border: none;
            }

            .pay-btn:hover {
              background: #1e40af;
            }

          .cancel-btn {
            background: white;
            border: 1px solid #d1d5db;
            color: #374151;
          }

          .cancel-btn:hover {
            background: #f3f4f6;
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
            <p><b>User id: ${payment[token].userId}</b></p>
            <p>You are paying</p>
            <div class="amount">Amount: ₹ ${payment[token].amount}</div>
          </div>

          <div class="btn-row">
            <form method="POST" action="/bank/pay/complete?token=${token}">
                <button type="submit" class="pay-btn" >
                    Approve Payment
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
    if(!token || !payment[token]) return res.json({message:"Token invalid"});
    const {userId,amount} = payment[token];
    payment[token].status="success";
    const webhook  = await axios.post(`${process.env.BACKEND_WEBHOOK_URL}/webhooks`,{token,userId,amount,status:"Success"});
    res.redirect(`${process.env.FRONTEND_URL}/success-payment?token=${token}`);
  } catch(error) {
    console.error("Payment failed",error);
    return res.status(500).json({data:payment});
  }
})

app.post('/bank/pay/cancel',async(req,res) => {
  try {
    const token=req.query.token;
    if(!token || !payment[token]) return res.json({message:"Token invalid"});
    const {userId,amount} = payment[token];
    payment[token].status = "failed";
    await axios.post(`${process.env.BACKEND_WEBHOOK_URL}/webhooks`,{token,userId,amount,status:"Failed"});
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-failed?token=${token}`
    );
  } catch(err) {
     console.error("Payment cancellatoin failed",err);
    return res.status(500).json({message:"Payment cancellatoin failed"});
  }
})

app.listen(process.env.PORT,() => {
  console.log("app listienng 3001")
})