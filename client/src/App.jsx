import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// Component and Page imports
import Home from "./pages/Home.jsx";
import Chats from "./pages/Chats.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Home page will display the login and registration forms */}
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
