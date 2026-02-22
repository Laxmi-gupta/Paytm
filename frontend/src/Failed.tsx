import { Link, useSearchParams } from "react-router-dom";

export const Failed = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl text-red-600">✕</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h2>

        <p className="text-gray-500 mb-6">
          Your transaction was not completed.
          No money has been deducted.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            to="/transaction"
            className="w-full block py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
          >
            Try Again
          </Link>

          <Link
            to="/dashboard"
            className="w-full block py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
          >
            Go to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};
