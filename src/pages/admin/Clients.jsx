import { useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { ALLUSERS } from "../../graphql/query/userQuery";
import toast from "react-hot-toast";
import { ADMINUPDATEUSER } from "../../graphql/mutations/userMutations";
import Loading from "../../components/Loading";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Clients = () => {
  const { data, loading, error, refetch } = useQuery(ALLUSERS);
  const [adminUpdate] = useMutation(ADMINUPDATEUSER);
  const [clients, setClients] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  useEffect(() => {
    if (data?.allUsers) {
      const filteredClients = data.allUsers.filter(
        (user) => user.role === "client"
      );
      setClients(filteredClients);
    }
  }, [data]);

  if (loading) return <Loading />;

  const sanitizePhoneNumber = (phone) => {
    const phoneStr = String(phone);
    if (phoneStr.startsWith("0")) return parseInt(phoneStr.slice(1), 10);
    if (phoneStr.startsWith("+254")) return parseInt(phoneStr.slice(4), 10);
    if (phoneStr.startsWith("254")) return parseInt(phoneStr.slice(3), 10);
    return parseInt(phoneStr, 10);
  };

  const openEditModal = (client) => {
    setCurrentClient(client);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const sanitizedPhone = sanitizePhoneNumber(currentClient.phone);
    const updatedClient = {
      _id: currentClient._id,
      name: currentClient.name,
      phone: sanitizedPhone,
      admin: currentClient.admin === "true",
      role: currentClient.role,
    };
    if (!updatedClient._id) return toast.error("No client ID.");
    console.log("Sending to mutation:", updatedClient);
    try {
      const { data } = await adminUpdate({
        variables: { input: updatedClient },
      });
      console.log("Mutation response:", data);
      await refetch();
      setShowEditModal(false);
      toast.success("Client Updated");
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClient((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {error? <p>Error fetching clients!</p> : <div className="p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Clients</h1>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">#</th>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">Name</th>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">Role</th>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">
                  Phone
                </th>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client, index) => (
                  <tr key={client._id} className="border-t">
                    <td className="py-2 px-4 text-xs sm:text-sm">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm">
                      {client.name}
                    </td>
                    <td className="py-2 px-4 capitalize text-xs sm:text-sm">
                      {client.role}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm">
                      {client.phone}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm">
                      <button
                        onClick={() => openEditModal(client)}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showEditModal && currentClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Client</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-xs sm:text-sm">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentClient.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded text-xs sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-xs sm:text-sm">
                    Role:
                  </label>
                  <select
                    name="role"
                    value={currentClient.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded text-xs sm:text-sm"
                    required
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                    <option value="worker">Employee</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-xs sm:text-sm">
                    Admin:
                  </label>
                  <select
                    name="admin"
                    value={currentClient.admin.toString()}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded text-xs sm:text-sm"
                    required
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-xs sm:text-sm">
                    Phone:
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={currentClient.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded text-xs sm:text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>}
          <div className="fixed bottom-10 right-6">
            <Link to="/" title="Go to Home">
              <IoHomeOutline
                className="text-blue-500 animate-pulse cursor-pointer"
                size={36}
              />
            </Link>
          </div>
    </div>
  );
};

export default Clients;
