import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";

import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>

      <div
        className="
        min-h-screen
        transition-all
        duration-300

        bg-[#f4f7fb]
        text-black

        dark:bg-[#09090b]
        dark:text-white
    "
      >

        <div className="flex bg-[#09090b] text-white min-h-screen">

          <Sidebar />

          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>

          <Toaster richColors position="top-right" />

        </div>
      </div>

    </BrowserRouter >
  );
}

export default App;