//import Avatar from 'react-avatar';

import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="flex items-center space-x-3 bg-gray-800 text-white p-3 rounded-lg shadow-md w-full">
      {/* Avatar with Random Background Color */}
      <Avatar name={username} size="40" round={true} className="shadow-lg" />

      {/* Username */}
      <span className="text-lg font-medium">{username}</span>
    </div>
  );
};

export default Client;