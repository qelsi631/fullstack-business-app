import { BrowserRouter, Routes, Route } from "react-router-dom";


import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";

function App() {
  return (
     <BrowserRouter>
       <Navbar/>

       <div className="app-layout">
        <Sidebar/>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard/>}  />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/products" element={<Products />} />

          </Routes>
        </main>
       </div>
     
     
     </BrowserRouter>
    
  );
}

export default App;