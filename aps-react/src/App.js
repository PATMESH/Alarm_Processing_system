import React, { useEffect, useState, lazy, Suspense } from "react";
import LoadingSpinner from "./Components/Effects/LoadingSpinner";

const Login = lazy(() => import('./Components/Login'))
const MainPage = lazy(() => import("./Components/MainPage"));

const LOCAL_STORAGE_KEYS = {  
  NAME: "name",
  AUTH_TOKEN: "auth-token"
};

function useAuth() {
  const [auth, setAuth] = useState({
    authenticated: false,
    token: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const name = localStorage.getItem(LOCAL_STORAGE_KEYS.NAME);
      if (name) {
        setAuth({
          authenticated: true,
          token: localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN) || "",
        });
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { auth, setAuth, loading };
}

function App() {
  const { auth, setAuth, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Suspense fallback={<LoadingSpinner />}>
        {!auth.authenticated ? (
          <Login setAuth={setAuth}/>
        ) : (
          <MainPage />
        )}
      </Suspense>
    </div>
  );
}

export default App;
