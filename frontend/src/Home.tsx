import type React from "react";

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
            
            <div className="absolute  right-[-80px] -translate-y-1/2 top-1/2 md:w-[360px] ">
              <div className="bg-gradient-to-br from-blue-500 to-green-400 
                              rounded-3xl h-[360px] 
                              flex items-center justify-center 
                              shadow-xl">
                <h2 className="text-white text-4xl font-bold text-center">
                  Payx <br />
                </h2>
              </div>
            </div>
          </div>
          
        </div>
      
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

          <div className="p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Fast Payments</h3>
            <p className="text-gray-600">
              Send and receive money instantly with zero friction.
            </p>
          </div>

          <div className="p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Secure Transfers</h3>
            <p className="text-gray-600">
              Industry-grade encryption keeps your money safe.
            </p>
          </div>

          <div className="p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Business Ready</h3>
            <p className="text-gray-600">
              Built for individuals and growing businesses.
            </p>
          </div>

        </div>
      </div>
    </div>
    </section>
  )
}