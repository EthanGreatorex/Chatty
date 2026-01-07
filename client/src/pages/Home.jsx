import "./Home.css";
import Loader from "../components/Loader/AnimatedStars.jsx";
import AccountForm from "../components/AccountForm/AccountForm.jsx";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <AccountForm onBack={() => setShowForm(false)} />;
  }
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
            Login or Register to start chatting!
          </h3>{" "}
          <button className="btn" onClick={() => setShowForm(true)}>
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}
