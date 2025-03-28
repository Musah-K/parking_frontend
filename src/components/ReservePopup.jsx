import React, { useState } from "react";

const ReservePopup = ({
  selectedSlotId,
  selectedSlotNumber,
  clients,
  onClose,
  onSubmit,
  reserveLoading,
}) => {
  const [bookedBy, setBookedBy] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTill, setValidTill] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");

  const handleClientSearchChange = (e) => {
    setClientSearchTerm(e.target.value);
    setBookedBy(""); // Reset selected client if search changes
  };

  const handleClientSelect = (client) => {
    setBookedBy(client._id);
    setClientSearchTerm(client.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookedBy) {
      // Optionally show an error if no client is selected
      return;
    }
    // Submit the required fields to the parent component
    onSubmit({
      bookedBy,
      validFrom,
      validTill,
      paymentId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl sm:text-2xl font-bold mb-4">Reserve Parking Slot</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Slot ID:</label>
            <input
              type="text"
              value={selectedSlotId}
              readOnly
              className="w-full border rounded p-2 bg-gray-100 text-sm"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Slot Number:</label>
            <input
              type="text"
              value={selectedSlotNumber}
              readOnly
              className="w-full border rounded p-2 bg-gray-100 text-sm"
            />
          </div>
          <div className="relative">
            <label className="block mb-1 text-sm font-semibold">
              Booked By (Client):
            </label>
            <input
              type="text"
              placeholder="Search client by name, vehicle or phone..."
              value={clientSearchTerm}
              onChange={handleClientSearchChange}
              className="w-full border rounded p-2 text-sm"
              autoComplete="off"
              required
            />
            {clientSearchTerm && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded mt-1 max-h-48 overflow-y-auto text-sm">
                {clients
                  .filter((client) => {
                    const searchLower = clientSearchTerm.toLowerCase();
                    return (
                      client.name.toLowerCase().includes(searchLower) ||
                      (client.vehicle &&
                        client.vehicle.toLowerCase().includes(searchLower)) ||
                      (client.phone &&
                        client.phone.toString().includes(searchLower))
                    );
                  })
                  .map((client) => (
                    <li
                      key={client._id}
                      onClick={() => handleClientSelect(client)}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                    >
                      {client.name} {client.vehicle ? `(${client.vehicle})` : ""}{" "}
                      {client.phone ? `- ${client.phone}` : ""}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Valid From:</label>
            <input
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Valid Till:</label>
            <input
              type="date"
              value={validTill}
              onChange={(e) => setValidTill(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold">Payment ID:</label>
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto text-sm"
            >
              {reserveLoading ? "Reserving..." : "Reserve Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservePopup;
