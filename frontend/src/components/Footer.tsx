import type React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white ">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className=" rounded-full"><img src="/logo.png" className="w-30"/></div>
              <span className="text-xl font-bold">PayX</span>
            </div>

            <p className="text-gray-600 max-w-sm">
              Making the world a better place through secure and
              seamless digital payments.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6 text-gray-500">
              <span className="hover:text-blue-600 cursor-pointer">Facebook</span>
              <span className="hover:text-blue-600 cursor-pointer">Instagram</span>
              <span className="hover:text-blue-600 cursor-pointer">Twitter</span>
              <span className="hover:text-blue-600 cursor-pointer">GitHub</span>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold mb-4">Solutions</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer">Marketing</li>
              <li className="hover:text-blue-600 cursor-pointer">Analytics</li>
              <li className="hover:text-blue-600 cursor-pointer">Automation</li>
              <li className="hover:text-blue-600 cursor-pointer">Commerce</li>
              <li className="hover:text-blue-600 cursor-pointer">Insights</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer">Submit Ticket</li>
              <li className="hover:text-blue-600 cursor-pointer">Documentation</li>
              <li className="hover:text-blue-600 cursor-pointer">Guides</li>
            </ul>
          </div>

         

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="hover:text-blue-600 cursor-pointer">Terms</li>
              <li className="hover:text-blue-600 cursor-pointer">Privacy</li>
              <li className="hover:text-blue-600 cursor-pointer">License</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Payx, Inc. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-blue-600 cursor-pointer">Terms</span>
            <span className="hover:text-blue-600 cursor-pointer">Privacy</span>
            <span className="hover:text-blue-600 cursor-pointer">Cookies</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
