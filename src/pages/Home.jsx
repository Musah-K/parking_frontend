import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { FiLogOut } from 'react-icons/fi';
import { useMutation, useApolloClient } from '@apollo/client';
import { LOGOUT } from '../graphql/mutations/userMutations';
import toast from 'react-hot-toast';

const Home = ({ user: newUser }) => {
  const [user, setUser] = useState(newUser);
  const navigate = useNavigate();
  const client = useApolloClient();

  useEffect(() => {
    setUser(newUser);
  }, [newUser]);

  // Redirect if user is null (logged out)
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [logout, { loading }] = useMutation(LOGOUT, {
    onCompleted: () => {
      toast.success('✅ Logged out successfully!');
      setUser(null); // Clear user data locally
      // Clear Apollo cache to remove stale auth data:
      client.resetStore();
      // The useEffect above will navigate to /login when user becomes null.
    },
    onError: (error) => {
      toast.error(`❌ Logout failed: ${error.message}`);
    },
  });

  const handleLogout = async () => {
    if (loading) return;
    await logout();
  };

  return (
    <div>
      <Nav />
      <div className="mt-8 flex flex-col items-center gap-3 z-50">
        <div className="underline text-lg flex gap-8 items-center">
          <span>{user?.name}</span>
          <div
            onClick={handleLogout}
            className="p-3 bg-purple-500 hover:text-lg cursor-pointer rounded-full"
          >
            <FiLogOut />
          </div>
        </div>
        <div className="flex justify-between px-2 w-screen max-w-sm">
          <div>{user && '0' + user.phone}</div>
          <div>{user && (user.vehicle || 'No vehicle registered')}</div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Home;
