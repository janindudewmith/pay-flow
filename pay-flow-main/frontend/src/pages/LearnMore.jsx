import React from 'react';

const LearnMore = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Learn more</h1>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our platform enables you to submit, track, and manage payment requests seamlessly from any device. Enjoy real-time updates, secure processing, and a streamlined experience tailored for your workflows.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Submit from anywhere</h2>
            <p className="text-gray-600">Create requests on desktop or mobile with guided forms and instant validation.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Track progress</h2>
            <p className="text-gray-600">Get visibility across each approval stage with clear status updates.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Stay notified</h2>
            <p className="text-gray-600">Receive notifications when actions are needed or statuses change.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Secure by design</h2>
            <p className="text-gray-600">Your data is protected with strong authentication and best practices.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;

