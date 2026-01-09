import type React from "react";
import { Lock,Building2,Wallet,Send,ArrowLeftRight,Shield} from "lucide-react"

export const Home: React.FC = () => {
  return (
    <section className="w-full bg-white">
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-blue-100 rounded-xl min-h-[380px] p-12 relative">
            <div className="max-w-xl">
                <h1 className="text-6xl  text-black leading-tight">
                  Pay <br />
                  friends. <br />
                  Pay for <br />
                  everything.
                </h1>

                <p className="mt-6 text-lg text-gray-700">
                Payment solutions built to work <br/>
                for your business
                </p>
            </div>
            
            <div className="absolute right-[-80px] -translate-y-1/2 top-1/2 md:w-[360px] ">
              <img src="/gradient.png" alt="" />
             
            </div>
          </div>
          
        </div>
      
      {/* middle cards */}
      <div className="py-20 bg-gray-50 text-center">
        <h1 className="text-3xl font-bold">Built for Real Transactions</h1>
        <p className="text-gray-500 mt-3">Everything you need to manage digital payments, backed by enterprise-</p>
        <p className="text-gray-500">grade infrastructure.</p>
        <div className="max-w-7xl h- mx-auto px-6 mt-14 grid md:grid-cols-3 gap-10"> 
          {[
             {
              icon: <Lock size={22} />,
              title: "JWT Authentication",
              desc: "Secure token-based authentication protecting all your transactions."
            },
            {
              icon: <Building2 size={22} />,
              title: "Bank Integration",
              desc: "Connect with our banking partner to fund your wallet seamlessly."
            },
            {
              icon: <Wallet size={22} />,
              title: "Digital Wallet",
              desc: "Store your money securely and access it anytime, anywhere."
            },
            {
              icon: <Send size={22} />,
              title: "P2P Transfers",
              desc: "Send money to anyone instantly with zero transfer fees."
            },
            {
              icon: <ArrowLeftRight size={22} />,
              title: "On-Ramp Support",
              desc: "Add money from your bank account directly to your wallet."
            },
            {
              icon: <Shield size={22} />,
              title: "Secure & Reliable",
              desc: "Enterprise-grade security for all your financial operations."
            }
          ].map((itm,idx) => (
            <div key={idx} className="group bg-white p-6 rounded-2xl border border-gray-200  hover:shadow-lg text-left min-h-[140px]">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-2 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                {itm.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{itm.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
              {itm.desc}
              </p>
          </div>
          )
        )}
        </div>
      </div>
    </div>
    </section>
  )
}