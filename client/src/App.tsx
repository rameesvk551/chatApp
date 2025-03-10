import React, { useEffect } from "react";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import HomePage from "./pages/HomePage";
import { userAuthStore } from "./store/userAuthStore.ts";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { isCheckingAuth, authState, checkAuth } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);
  console.log(authState);
  

  if (isCheckingAuth  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={authState ? <HomePage /> : <LoginPage />} />
        <Route
          path="/login"
          element={!authState ? <LoginPage /> : <HomePage />}
        />
        <Route
          path="/signup"
          element={! authState ? <SignupPage /> : <HomePage />}
        />
        <Route
          path="/profile"
          element={authState ? <ProfilePage /> : <LoginPage />}
        />
        <Route
          path="/settings"
          element={authState ? <SettingsPage /> : <LoginPage />}
        />
      </Routes>
      <Toaster/>
    </div>
  );
};

export default App;
