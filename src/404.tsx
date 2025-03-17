import { FaGithub } from "react-icons/fa";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-grow flex flex-col items-center justify-center'>
        <h1 className='mb-6 font-[Sigmar]'>404 - Page Not Found</h1>
        <Link className="button" to={"/dashboard"}>Home</Link>
      </div>
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 self-end">
        <aside>
          <p><Link target='_blank' to={"https://github.com/AhmedHHamdy/habit-tracker-react-appwrite"} className='flex items-center hover:text-purple-300'><FaGithub className='w-16 h-6' /> Ahmed Hamdy</Link></p>
        </aside>
      </footer>
    </div>
  );
}