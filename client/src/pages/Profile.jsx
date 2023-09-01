import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const userDetails = useSelector((state) => state.user.userDetails);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleUpdateClick = () => {
    
  };

  return (
    <div className="flex items-center justify-center mt-20">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded p-6 border">
          <div className="text-center mb-4">
            <h2 className="text-2xl">User Profile</h2>
          </div>
          <div className="mb-4">
            <strong>Username:</strong> {userDetails.username}
          </div>
          <div className="mb-4">
            <strong>Email:</strong> {userDetails.email}
          </div>
          {userDetails.address &&(
          <div className="mb-4">
            <strong>Address:</strong> {userDetails.address}
          </div>
          )}
          <div className="flex justify-center">
            <button
              onClick={handleUpdateClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
