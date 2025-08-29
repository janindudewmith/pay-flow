import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.publicMetadata?.role) {
      alert('Access denied. Please login as an admin.');
      navigate('/admin-login');
    }
  }, [user]);

  const role = user?.publicMetadata?.role;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome {role === 'dep_head' ? 'Department Head' : 'Finance Officer'} 👋</h1>
      {/* Load appropriate dashboard here */}
    </div>
  );
};

export default AdminDashboard;
