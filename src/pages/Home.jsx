import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { FiLogOut } from "react-icons/fi";
import { useMutation, useApolloClient } from "@apollo/client";
import { LOGOUT } from "../graphql/mutations/userMutations";
import toast from "react-hot-toast";
import UpdateUser from "../components/UpdateUser";
import Footer from "../components/Footer";

const Home = ({ user: newUser }) => {
  const [user, setUser] = useState(newUser);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const navigate = useNavigate();
  const client = useApolloClient();

  useEffect(() => {
    setUser(newUser);
  }, [newUser]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [logout, { loading }] = useMutation(LOGOUT, {
    onCompleted: async () => {
      toast.success("✅ Logged out successfully!");
      setUser(null);
      await client.resetStore();
    },
    onError: (error) => {
      toast.error(`❌ Logout failed: ${error.message}`);
    },
  });

  const handleLogout = async () => {
    if (loading) return;
    await logout();
  };

  // Function to open the update popup
  const handleOpenUpdate = () => {
    setShowUpdateModal(true);
  };

  // Function to close the update popup
  const handleCloseUpdate = () => {
    setShowUpdateModal(false);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="min-h-screen">
        <Nav />
        <div className="mt-8 flex flex-col items-center gap-3 z-50">
          {/* User name and logout */}
          <div className="underline text-lg flex gap-8 items-center">
            <button onClick={handleOpenUpdate} className="cursor-pointer text-left">
              <span>{user.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-3 bg-purple-500 hover:bg-purple-600 cursor-pointer rounded-full"
              title="Logout"
            >
              <FiLogOut size={24} className="text-white" />
            </button>
          </div>

          {/* User phone and role/vehicle info */}
          <div className="flex justify-between px-2 w-screen max-w-sm text-sm">
            <div>{user?.phone ? "0" + user.phone : "No phone number"}</div>
            <div>
              {user?.role === "admin"
                ? "ADMIN"
                : user?.role === "worker"
                ? "Employee"
                : user?.vehicle || "No vehicle registered"}
            </div>
          </div>
        </div>

        <Outlet />

        {/* Update user popup modal */}
        {showUpdateModal && (
          <UpdateUser user={user} onClose={handleCloseUpdate} />
        )}
      </div>
        <Footer/>
    </div>
  );
};

export default Home;
