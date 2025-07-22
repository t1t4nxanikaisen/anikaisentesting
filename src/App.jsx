import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Root from "./pages/Root";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import useSidebarStore from "./store/sidebarStore";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import ScrollToTop from "./utils/ScrollToTop";
import SearchResult from "./pages/SearchResult";
import WatchPage from "./pages/WatchPage";
import PageNotFound from "./pages/PageNotFound";
import PeopleInfoPage from "./pages/PeopleInfoPage";
import CharacterInfoPage from "./pages/CharacterInfoPage";
import CharactersPage from "./pages/CharactersPage";

// Import new components
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import { AuthProvider, AuthContext } from "./components/AuthContext";
import React from "react";

const RequireAdmin = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const togglesidebar = useSidebarStore((state) => state.toggleSidebar);
  const location = useLocation();
  const path = location.pathname === "/";

  return (
    <AuthProvider>
      <>
        {!path && <Sidebar />}

        <main className={`${isSidebarOpen ? "bg-active" : ""} opacityWrapper`}>
          <div
            onClick={togglesidebar}
            className={`${isSidebarOpen ? "active" : ""} opacityBg`}
          ></div>
          {!path && <Header />}
          <ScrollToTop />
          <Routes>
            {/* Existing routes */}
            <Route path="/" element={<Root />} />
            <Route path="/home" element={<Home />} />
            <Route path="/anime/:id" element={<DetailPage />} />
            <Route path="/animes/:category/:query?" element={<ListPage />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/characters/:id" element={<CharactersPage />} />
            <Route path="/people/:id" element={<PeopleInfoPage />} />
            <Route path="/character/:id" element={<CharacterInfoPage />} />
            <Route path="*" element={<PageNotFound />} />

            {/* New auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin panel route protected by role */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPanel />
                </RequireAdmin>
              }
            />
          </Routes>
        </main>
      </>
    </AuthProvider>
  );
};

export default App;
