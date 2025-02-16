import "./App.css";
import { Routes, Route } from "react-router"
import Home from "./Home";
import Dashboard from "./Dashboard";
import AuthRequired from "./components/AuthRequired";
import HabitDetails from "./HabitDetails";
import Register from "./register";


function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/dashboard" element={<AuthRequired />}>
          <Route index element={<Dashboard />} /> 
          <Route path="habitDetails/:id" element={<HabitDetails />} /> 
        </Route>
      </Route>

    </Routes>
  );
}

export default App;
