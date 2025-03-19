import toast, { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useMutation, useQuery } from "@apollo/client";
import { Authenticate } from "./graphql/query/userQuery";
import { useEffect } from "react";
import Client from "./pages/Client";
import Employee from "./pages/Employee";
import Admin from "./pages/Admin";
import { UpdateExpired } from "./graphql/mutations/parkingSlotsMutation";
import Reserved from "./pages/Client/Reserved";
import Reserve from "./pages/Client/Reserve";

function App() {
  const [removeExpiredSlots] = useMutation(UpdateExpired);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await removeExpiredSlots();
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, [removeExpiredSlots]);

  // Always fetch a fresh authentication state
  const { data: userData, loading: loadingUser } = useQuery(Authenticate, {
    fetchPolicy: "network-only",
  });

  if (loadingUser) return <div>Loading...</div>;

  // Determine if the user is authenticated
  const isAuthenticated = !!userData?.authUser;

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
        />

        {/* Private route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home user={userData.authUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {userData?.authUser?.role === "user" ? (
            <Route element={<Client user={userData.authUser} />}>
              <Route index element={<Reserved />} />
              <Route path="reserve" element={<Reserve />} />
            </Route>
          ) : userData?.authUser?.role === "worker" ? (
            <Route index element={<Employee />} />
          ) : (
            <Route index element={<Admin />} />
          )}
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
