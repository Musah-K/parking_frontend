import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const InputField = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  // Determine if the field should have the toggle feature.
  const isPassword = id === "password" || id ==="password1" ||id === "oldPassword" ||id === "newPassword" ||id === "confirmNewPassword";

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="block mb-1 font-semibold">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full p-2 border rounded pr-10"
      />
      {isPassword && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-2 top-1/2 text-gray-600"
          tabIndex={-1}
        >
          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </button>
      )}
    </div>
  );
};

export default InputField;
