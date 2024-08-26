import React, { useState, useEffect } from "react";
import AdminView from "./views/AdminView";
import UserView from "./views/UserView";
import LoadingSpinner from "./Effects/LoadingSpinner";

const MyDevices = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await localStorage.getItem("role");
      setRole(storedRole);
      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {role === "Admin" ? <AdminView /> : <UserView />}
    </div>
  );
};

export default MyDevices;
