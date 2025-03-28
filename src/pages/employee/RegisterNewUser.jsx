import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ADMINCREATEUSER } from '../../graphql/mutations/userMutations';
import InputField from '../../components/InputField';
import { Link, useNavigate } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

const RegisterNewUser = () => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    password: '',
    password1: ''
  });

  const [register, { loading }] = useMutation(ADMINCREATEUSER);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setSignUpData((prevData) => ({
        ...prevData,
        gender: value,
      }));
    } else {
      setSignUpData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const sanitizePhoneNumber = (phone) => {
    if (phone.startsWith('0')) {
      return parseInt(phone.slice(1), 10);
    } else if (phone.startsWith('+254')) {
      return parseInt(phone.slice(4), 10);
    } else if (phone.startsWith('254')) {
      return parseInt(phone.slice(3), 10);
    }
    return parseInt(phone, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.password1) {
      return toast.error("Password does not match");
    }

    try {
      const sanitizedPhone = sanitizePhoneNumber(signUpData.phone);
      const { data } = await register({
        variables: {
          input: {
            name: signUpData.name,
            phone: sanitizedPhone,
            password: signUpData.password,
            vehicle: signUpData.vehicle,
          },
        },
      });
      console.log(data);
      toast.success("User successfully registered");
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className='h-screen relative flex justify-center items-center px-4'>
      <div className='w-full max-w-md bg-gray-100 rounded-lg shadow-md overflow-hidden'>
        <div className='p-6'>
          <h1 className='text-3xl font-semibold mb-4 text-black text-center'>
            NEW USER
          </h1>
          <h2 className='text-sm font-semibold mb-6 text-gray-500 text-center'>
            ADD NEW USER
          </h2>

          <form className='space-y-4' onSubmit={handleSubmit}>
            <InputField
              label='Name'
              id='name'
              name='name'
              onChange={handleChange}
              value={signUpData.name}
              required
            />
            <InputField
              label='Phone (M-PESA)'
              id='phone'
              name='phone'
              type='number'
              onChange={handleChange}
              value={signUpData.phone}
              required
            />
            <InputField
              label='Vehicle no.'
              id='vehicle'
              name='vehicle'
              type='text'
              onChange={handleChange}
              value={signUpData.vehicle}
            />
            <InputField
              label='Password'
              id='password'
              name='password'
              type='password'
              onChange={handleChange}
              value={signUpData.password}
              required
            />
            <InputField
              label='Confirm password'
              id='password1'
              name='password1'
              type='password'
              onChange={handleChange}
              value={signUpData.password1}
              required
            />

            <button
              type='submit'
              className='w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={loading}
            >
              {loading ? 'Signing up ...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>

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

export default RegisterNewUser;
