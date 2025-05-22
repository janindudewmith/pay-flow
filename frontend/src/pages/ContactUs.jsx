import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-750 to-blue-600 text-white py-8 text-center rounded-xl mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-lg">Get in touch with the PayFlow team</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-800 text-lg mb-2">Faculty of Engineering</h3>
                  <p className="text-gray-600">University of Ruhuna</p>
                  <p className="text-gray-600">Hapugala, Galle</p>
                  <p className="text-gray-600">Sri Lanka</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 text-lg mb-2">Support</h3>
                  <p className="text-gray-600">Email: support@payflow.ruh.ac.lk</p>
                  <p className="text-gray-600">Phone: +94 91 224 5767</p>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-800 text-lg mb-2">Send us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Message subject"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Location</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.1234567890123!2d80.12345678901234!3d6.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuNCJOIDgwwrAwNycwMC4wIkU!5e0!3m2!1sen!2slk!4v1234567890123"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 