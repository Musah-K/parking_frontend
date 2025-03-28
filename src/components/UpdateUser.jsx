import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATEUSER } from '../graphql/mutations/userMutations';
import toast from 'react-hot-toast';
import { Authenticate } from '../graphql/query/userQuery';
import InputField from './InputField';
import { FiX } from 'react-icons/fi';

const UpdateUser = ({ user, onClose }) => {
  const [updateUser, { loading }] = useMutation(UPDATEUSER, {
    refetchQueries: [{ query: Authenticate }],
  });

  const [updateData, setUpdateData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    if (user) {
      setUpdateData({
        name: user.name || '',
        phone: user.phone || '',
        vehicle: user.vehicle || '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sanitizePhoneNumber = (phone) => {
    const phoneStr = phone.toString();
    if (phoneStr.startsWith('0')) {
      return parseInt(phoneStr.slice(1), 10);
    } else if (phoneStr.startsWith('+254')) {
      return parseInt(phoneStr.slice(4), 10);
    } else if (phoneStr.startsWith('254')) {
      return parseInt(phoneStr.slice(3), 10);
    }
    return parseInt(phoneStr, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updateData.newPassword !== '' || updateData.confirmNewPassword !== '') {
      if (!updateData.oldPassword) {
        return toast.error("Old password is required to update your password.");
      }
      if (updateData.newPassword !== updateData.confirmNewPassword) {
        return toast.error("New passwords do not match");
      }
    }

    try {
      const sanitizedPhone = sanitizePhoneNumber(updateData.phone);
      
      // Build the input payload. Only include password fields if newPassword is provided.
      const inputPayload = {
        name: updateData.name,
        phone: sanitizedPhone,
        vehicle: updateData.vehicle,
      };

      if (updateData.newPassword !== '') {
        inputPayload.oldPassword = updateData.oldPassword;
        inputPayload.password = updateData.newPassword;
      }

      const { data } = await updateUser({
        variables: {
          id: user._id,
          input: inputPayload,
        },
      });
      console.log(data);
      toast.success('User updated successfully!');
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Update failed. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          title="Close"
        >
          <FiX size={24} />
        </button>
        <h1 className="text-3xl font-semibold mb-6 text-black text-center">
          Update User
        </h1>
        <p className="text-sm font-semibold mb-6 text-gray-500 text-center">
          Update your profile information.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Name"
            id="name"
            name="name"
            onChange={handleChange}
            value={updateData.name}
            required
          />
          <InputField
            label="Phone (M-PESA)"
            id="phone"
            name="phone"
            type="number"
            onChange={handleChange}
            value={updateData.phone}
            required
          />
          <InputField
            label="Vehicle no."
            id="vehicle"
            name="vehicle"
            type="text"
            onChange={handleChange}
            value={updateData.vehicle}
          />

          <InputField
            label="Old Password"
            id="oldPassword"
            name="oldPassword"
            type="password"
            onChange={handleChange}
            value={updateData.oldPassword}
            placeholder="******"
          />
          <InputField
            label="New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            onChange={handleChange}
            value={updateData.newPassword}
            placeholder="******"
          />
          <InputField
            label="Confirm New Password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            onChange={handleChange}
            value={updateData.confirmNewPassword}
            placeholder="******"
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
