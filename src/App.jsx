import "./App.css";
import { Routes, Route } from "react-router"
import Home from "./Home";
import Dashboard from "./Dashboard";
import AuthRequired from "./components/AuthRequired";
import HabitDetails from "./HabitDetails";
import Register from "./register";
import NotFound from "./404";


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

        <Route path="*" element={<NotFound />} /> 
      </Route>

    </Routes>
  );
}

export default App;
