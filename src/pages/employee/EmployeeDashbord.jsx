import { useQuery, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { AVAILABLE_SLOTS } from "../../graphql/query/parkingSlotsQuery";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { EMPLOYEERESERVESPORT } from "../../graphql/mutations/parkingSlotsMutation";
import { ALLUSERS } from "../../graphql/query/userQuery";
import ReservePopup from "../../components/ReservePopup";
import { IoMdAdd } from "react-icons/io";

const EmployeeDashbord = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showReserveForm, setShowReserveForm] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [selectedSlotNumber, setSelectedSlotNumber] = useState("");

  // Fetch slots
  const {
    data: occupiedData,
    loading: occupiedLoading,
    error: occupiedError,
    refetch
  } = useQuery(AVAILABLE_SLOTS, {
    variables: { available: false },
  });

  const {
    data: unbookedData,
    loading: unbookedLoading,
    error: unbookedError,
    refetch: refetchUnbooked
  } = useQuery(AVAILABLE_SLOTS, {
    variables: { available: true },
  });
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(ALLUSERS);

  const [reserveSlot, { loading: reserveLoading }] =
    useMutation(EMPLOYEERESERVESPORT);

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const timestamp = date?.$date?.$numberLong || date?.$date || date;
      return new Date(parseInt(timestamp)).toISOString().split("T")[0];
    } catch (error) {
      console.error("Invalid date format:", date);
      return "Invalid Date";
    }
  };

  if (occupiedLoading || unbookedLoading || usersLoading) return <Loading />;
  if (usersError) return <p>Error loading users: {usersError.message}</p>;

  const occupiedSlots = occupiedData?.availableSlots || [];
  const unbookedSlots = unbookedData?.availableSlots || [];

  const filteredOccupied = occupiedSlots.filter((slot) => {
    const slotNumber = slot.slotNumber.toString();
    const bookedByName = slot.bookedBy?.name?.toLowerCase() || "";
    const vehicle = slot.bookedBy?.vehicle?.toLowerCase() || "";
    return (
      slotNumber.includes(searchTerm) ||
      bookedByName.includes(searchTerm.toLowerCase()) ||
      vehicle.includes(searchTerm.toLowerCase())
    );
  });

  const filteredUnbooked = unbookedSlots.filter((slot) => {
    const slotNumber = slot.slotNumber.toString();
    return slotNumber.includes(searchTerm);
  });

  // Filter clients whose role is "client"
  const clients = (usersData?.allUsers || []).filter(
    (user) => user.role === "client"
  );

  // Open the ReservePopup and store both the slot id and slot number.
  const openReservePopup = (slotId, slotNumber) => {
    setSelectedSlotId(slotId);
    setSelectedSlotNumber(slotNumber);
    setShowReserveForm(true);
  };

  const handleReserveSubmit = async (inputData) => {
    console.log(inputData);
    
    try {
      await reserveSlot({
        variables: {
          id: selectedSlotId,
          input: {
            isAvailable: false, 
            bookedBy: inputData.bookedBy,
            validFrom: inputData.validFrom,
            validTill: inputData.validTill,
            mpesa: inputData.paymentId,
          },
        },
      });
      toast.success("Slot reserved successfully!");
      setSelectedSlotId("");
      setSelectedSlotNumber("");
      setShowReserveForm(false);
      refetchUnbooked();
      refetch();
    } catch (err) {
      toast.error("Failed to reserve slot");
      console.error(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl sm:text-3xl font-bold mb-6">Parking Slots</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by slot number, name, or vehicle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-blue-400 transition duration-300"
        />
      </div>

      <h2 className="text-base sm:text-2xl font-semibold mb-4">Occupied Parking Slots</h2>
      {occupiedError?occupiedError.message : <div className="overflow-x-auto shadow-xl rounded-lg mb-8">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left">#</th>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left">Slot Number</th>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left">Booked By</th>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left">Vehicle</th>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left max-[479px]:hidden">Valid From</th>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left max-[479px]:hidden">Valid Till</th>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOccupied.length > 0 ? (
              filteredOccupied.map((slot, index) => (
                <tr
                  key={slot._id}
                  className="hover:bg-blue-50 transition-transform duration-300 ease-in-out transform hover:scale-105"
                >
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm">{index + 1}</td>
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm font-semibold">
                    #{slot.slotNumber}
                  </td>
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm">
                    {slot.bookedBy?.name || "Unknown"}
                  </td>
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm">
                    {slot.bookedBy?.vehicle || "Not provided"}
                  </td>
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm max-[479px]:hidden">
                    {formatDate(slot.validFrom)}
                  </td>
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm max-[479px]:hidden">
                    {formatDate(slot.validTill)}
                  </td>
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm">
                    <span className="px-1 py-0.5 sm:px-2 sm:py-1 rounded-full font-semibold bg-red-200 text-red-800">
                      Occupied
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500 text-xs sm:text-sm">
                  No occupied slots found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>}

      <h2 className="text-base sm:text-2xl font-semibold mb-4">Unbooked Parking Slots</h2>
      {unbookedError?unbookedError.message : <div className="overflow-x-auto shadow-xl rounded-lg mb-8">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-500 to-green-700 text-white">
            <tr>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left">#</th>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left">Slot Number</th>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left">Status</th>
              <th className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUnbooked.length > 0 ? (
              filteredUnbooked.map((slot, index) => (
                <tr
                  key={slot._id}
                  className="hover:bg-green-50 transition-transform duration-300"
                >
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm">{index + 1}</td>
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm font-semibold">
                    #{slot.slotNumber}
                  </td>
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm">
                    <span className="px-1 py-0.5 sm:px-2 sm:py-1 rounded-full font-semibold bg-green-200 text-green-800">
                      Available
                    </span>
                  </td>
                  <td className="py-1 px-1 sm:py-2 sm:px-2 text-xs sm:text-sm">
                    <button
                      onClick={() =>
                        openReservePopup(slot._id, slot.slotNumber)
                      }
                      className="bg-blue-500 text-white px-1 py-1 sm:px-2 sm:py-1 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Reserve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500 text-xs sm:text-sm">
                  No unbooked slots found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>}

      {showReserveForm && (
        <ReservePopup
          selectedSlotId={selectedSlotId}
          selectedSlotNumber={selectedSlotNumber}
          clients={clients}
          onClose={() => setShowReserveForm(false)}
          onSubmit={handleReserveSubmit}
          reserveLoading={reserveLoading}
        />
      )}

      <div className="fixed bottom-10 right-6">
        <Link to="addnewuser" title="Go to Home">
          <IoMdAdd
            className="text-blue-500 animate-pulse cursor-pointer"
            size={36}
          />
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashbord;
