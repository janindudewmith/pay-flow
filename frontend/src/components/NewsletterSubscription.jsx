import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/newsletter/subscribe', {
        email
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error subscribing to newsletter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-semibold text-white mt-5 mb-3">Subscribe to our newsletter</h2>
      <p className="text-sm text-white/80">
        Stay updated with the latest news, articles and insights delivered straight to your inbox.
      </p>
      <div className='flex items-center gap-2 pt-4'>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'
          required
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className='bg-blue-600 w-24 h-9 text-white rounded'
        >
          {loading ? '...' : 'Subscribe'}
        </button>
      </div>
    </div>
  );
};

export default NewsletterSubscription; 