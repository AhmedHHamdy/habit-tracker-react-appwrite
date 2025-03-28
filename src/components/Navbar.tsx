import { Link } from "react-router";
import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="navbar-start">
        <Link to={"/dashboard"} className="btn btn-ghost font-[Sigmar] text-3xl">Habit Hustle</Link>
      </div>
      {user && <div className="navbar-center hidden lg:flex">
        <span className="uppercase font-medium text-lg">{user?.name}</span>
      </div>}
      {user && <div className="navbar-end">
        <button className="btn btn-secondary" onClick={() => logout()}>Logout</button>
      </div>}
    </div>
  );
}
