import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative flex space-x-2">
        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default Loading;
