import { Link, Navigate, Outlet } from "react-router-dom"; // Correct import
import { useAuth } from "../context/AuthProvider";
import Navbar from "./Navbar";
import { FaGithub } from "react-icons/fa";

export default function AuthRequired() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <section className="flex flex-col min-h-screen">
      <Navbar />
      
      <section className="flex-grow flex flex-col item-center justify-start p-4" >
        <Outlet />
      </section>

      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p><Link target='_blank' to={"https://github.com/AhmedHHamdy/habit-tracker-react-appwrite"} className='flex items-center hover:text-purple-300'><FaGithub className='w-16 h-6' /> Ahmed Hamdy</Link></p>
        </aside>
      </footer>
    </section>
  );
}
