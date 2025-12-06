import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard"; 
import Residents from "./Residents"; 
import Payments from "./Payments"; 
import Complaints from "./Complaints"; 
import Notices from "./Notices"; 
import { Toaster } from 'react-hot-toast';
import Parking  from "./Parking"; 
import Visitors from "./Visitors"; 
import Settings from "./Settings";
import Events from "./Events";
import { MessageCircle } from "lucide-react";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
              {/* 🟢 Protected Routes */}
        <Route path="/dashboard" 
               element= {<PrivateRoute ><Dashboard /></PrivateRoute>}/>
        <Route path="/residents"
               element= {<PrivateRoute><Residents /></PrivateRoute>}/>
        <Route path="/payments"
               element= {<PrivateRoute><Payments /></PrivateRoute>}/>
        <Route path="/complaints" 
               element= {<PrivateRoute><Complaints /></PrivateRoute>}/> 
        <Route path="/notices" 
               element= {<PrivateRoute><Notices /></PrivateRoute>}/> 
        <Route path="/parking"
               element= {<PrivateRoute><Parking /></PrivateRoute>}/>
        <Route path="/visitors"
               element= {<PrivateRoute><Visitors /></PrivateRoute>}/> 
        <Route path="/events" 
               element= {<PrivateRoute><Events /></PrivateRoute>} /> 
        <Route path="/settings" 
               element= {<PrivateRoute><Settings /></PrivateRoute>} /> 
      </Routes>
       {/* 🟢 Floating WhatsApp Button */}
      <a
        href="https://wa.me/923001234567?text=Emergency%20Alert!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 z-50"
      >
        <MessageCircle size={24} />
      </a>
       {/* 🟢 Toast Notifications */}
    <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;

