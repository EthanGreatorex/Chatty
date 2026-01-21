import "./Home.css";
import Loader from "../components/Loader/AnimatedStars.jsx";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="main flex flex-col justify-center items-center h-screen bg-black">
        <div className="hero text-center">
          <div className="flex justify-center gap-4 mt-4">
            <FaGithub
              className="icon mt-2"
              size={30}
              onClick={() => window.open("https://github.com/EthanGreatorex")}
            />
            <FaLinkedin
              className="icon mt-2"
              size={30}
              onClick={() =>
                window.open("https://uk.linkedin.com/in/ethan-greatorex")
              }
            />
          </div>
          <h1 className="text-5xl text-white font-bold">Welcome to Chatty</h1>
          <Loader />
          <h3 className="text-neutral-500 text-2xl mb-6">
            Application current out of service due to server costs. Sorry for the
            inconvenience.
          </h3>{" "}
          <button
            className="btn"
            onClick={() => (window.location.href = "/login")}
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
