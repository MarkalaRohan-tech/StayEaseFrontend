export default function TermsAndConditions() {
  return (
    <div className=" absolute top-25 min-h-screen w-full h-full bg-white mb-5 flex justify-center items-center py-16 px-6">
      <div className="max-w-3xl w-full shadow-lg rounded-xl border-t-4 border-yellow-400 p-8">
        <h1 className="text-3xl font-bold text-center text-yellow-400 text-shadow-2xl mb-4">
          Terms & Conditions
        </h1>
        <p className="text-gray-800 text-sm mb-4">
          Welcome to StayEase! By using our platform, you agree to the following
          terms and conditions. Please read them carefully before using our
          services.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-700">
          1. User Agreement
        </h2>
        <p className="text-sm text-gray-700">
          By registering and using StayEase, you agree that you are responsible
          for maintaining the confidentiality of your account credentials and
          for all activities under your account.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-700">
          2. Booking Policies
        </h2>
        <p className="text-sm text-gray-700">
          All bookings are subject to availability. Hosts are responsible for
          listing accurate details. StayEase is not liable for disputes between
          users and hosts.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-700">
          3. Cancellation & Refund
        </h2>
        <p className="text-sm text-gray-700">
          Cancellation and refund policies are governed by the terms set by each
          host. Please review listing-specific rules before booking.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-700">
          4. Code of Conduct
        </h2>
        <p className="text-sm text-gray-700">
          Users must not engage in any activity that is harmful, abusive,
          illegal, or violates the community standards of StayEase.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-700">
          5. Modifications
        </h2>
        <p className="text-sm text-gray-700">
          We may revise these terms from time to time. Continued use of the
          platform after changes implies your acceptance of the new terms.
        </p>

        <p className="mt-6 text-sm text-gray-600">Last updated: July 2025</p>
      </div>
    </div>
  );
}
