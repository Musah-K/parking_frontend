import { useQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { ALLUSERS } from "../../graphql/query/userQuery";
import toast from "react-hot-toast";
import { ADMINUPDATEUSER } from "../../graphql/mutations/userMutations";
import Loading from "../../components/Loading";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Employees = () => {
  const { data, loading, error, refetch } = useQuery(ALLUSERS);
  const [adminUpdate] = useMutation(ADMINUPDATEUSER);
  const [workers, setWorkers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);

  useEffect(() => {
    if (data?.allUsers) {
      const filteredWorkers = data.allUsers.filter(
        (user) => user.role === "worker"
      );
      setWorkers(filteredWorkers);
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

  const openEditModal = (worker) => {
    setCurrentWorker(worker);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const sanitizedPhone = sanitizePhoneNumber(currentWorker.phone);
    const updatedWorker = {
      _id: currentWorker._id,
      name: currentWorker.name,
      phone: sanitizedPhone,
      admin: currentWorker.admin === "true",
      role: currentWorker.role,
    };
    if (!updatedWorker._id) return toast.error("No employee ID.");
    console.log("Sending to mutation:", updatedWorker);
    try {
      await adminUpdate({
        variables: { input: updatedWorker },
      });
      await refetch();
      setShowEditModal(false);
      toast.success("User Updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentWorker((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {error? <p>Error fetching employees!</p> : <div className="p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Employees</h1>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">#</th>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">Name</th>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">Role</th>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">Phone</th>
                <th className="py-2 px-4 text-left text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.length > 0 ? (
                workers.map((worker, index) => (
                  <tr key={worker._id} className="border-t">
                    <td className="py-2 px-4 text-xs sm:text-sm">{index + 1}</td>
                    <td className="py-2 px-4 text-xs sm:text-sm">{worker.name}</td>
                    <td className="py-2 px-4 capitalize text-xs sm:text-sm">{worker.role}</td>
                    <td className="py-2 px-4 text-xs sm:text-sm">{worker.phone}</td>
                    <td className="py-2 px-4 text-xs sm:text-sm">
                      <button
                        onClick={() => openEditModal(worker)}
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
                    No workers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showEditModal && currentWorker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Worker</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-xs sm:text-sm">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentWorker.name}
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
                    value={currentWorker.role}
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
                    value={currentWorker.admin.toString()}
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
                    value={currentWorker.phone}
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

export default Employees;
