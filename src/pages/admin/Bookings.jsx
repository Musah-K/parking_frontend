import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AVAILABLE_SLOTS } from "../../graphql/query/parkingSlotsQuery";
import Loading from "../../components/Loading";

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error } = useQuery(AVAILABLE_SLOTS, {
    variables: { available: false },
  });

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

  const filteredSlots =
    data?.availableSlots.filter((slot) => {
      const slotNumber = slot.slotNumber.toString();
      const bookedBy = slot.bookedBy?.name?.toLowerCase() || "";
      const vehicle = slot.bookedBy?.vehicle?.toLowerCase() || "";

      return (
        slotNumber.includes(searchTerm) ||
        bookedBy.includes(searchTerm.toLowerCase()) ||
        vehicle.includes(searchTerm.toLowerCase())
      );
    }) || [];

  if (loading) return <Loading />;
  // if (error) return <p>No booked parking slots found</p>;

  return (
    <div>
      {error?<p>No booked parking slots found</p>:<div className="p-4">
        <h1 className="text-xl sm:text-3xl font-bold mb-6">
          Occupied Parking Slots
        </h1>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search by slot number, name, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 sm:p-3 border rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-blue-400 transition duration-300 text-xs sm:text-sm"
          />
        </div>

        <div className="overflow-x-auto shadow-xl rounded-lg">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <tr>
                <th className="py-2 px-2 sm:py-4 sm:px-4 text-left text-xs sm:text-sm">
                  #
                </th>
                <th className="py-2 px-2 sm:py-4 sm:px-4 text-left text-xs sm:text-sm">
                  Slot Number
                </th>
                <th className="py-2 px-2 sm:py-4 sm:px-4 text-left text-xs sm:text-sm">
                  Booked By
                </th>
                <th className="py-2 px-2 sm:py-4 sm:px-4 text-left text-xs sm:text-sm">
                  Vehicle
                </th>
                <th className="py-2 px-2 sm:py-4 sm:px-4 text-left text-xs sm:text-sm">
                  Valid From
                </th>
                <th className="py-2 px-2 sm:py-4 sm:px-4 text-left text-xs sm:text-sm">
                  Valid Till
                </th>
                <th className="py-2 px-2 sm:py-4 sm:px-4 text-left text-xs sm:text-sm">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot, index) => (
                  <tr
                    key={slot._id}
                    className="hover:bg-blue-50 transition-transform duration-300 ease-in-out transform hover:scale-105"
                  >
                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">
                      {index + 1}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm font-semibold">
                      #{slot.slotNumber}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">
                      {slot.bookedBy?.name || "Unknown"}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">
                      {slot.bookedBy?.vehicle || "Not provided"}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">
                      {formatDate(slot.validFrom)}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">
                      {formatDate(slot.validTill)}
                    </td>
                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">
                      <span
                        className={`px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                          slot.isAvailable
                            ? "bg-green-200 text-green-800 animate-pulse"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {slot.isAvailable ? "Available" : "Occupied"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-4 text-center text-gray-500 text-xs sm:text-sm"
                  >
                    No occupied slots found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

export default Bookings;
