import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaSearch, FaComments, FaLightbulb } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const aboutRef = useRef(null);

  const scrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="max-w-[150rem] mx-auto w-full px-4 md:px-8 py-5 flex justify-between items-center">
          <div
            className="text-6xl md:text-4xl font-extrabold text-blue-800 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Smart Event Buddy
          </div>
          <ul className="flex flex-wrap space-x-10 md:space-x-6 items-center text-3xl font-semibold">
            <li>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-blue-800 hover:text-blue-500"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={scrollToAbout}
                className="text-blue-800 hover:text-blue-500"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/login")}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
              >
                Login
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/register")}
                className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition"
              >
                Register
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-24 px-6 text-center w-full flex-1">
        <div className="max-w-[150rem] mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold mb-8 leading-tight break-words">
            Welcome to Smart Event Buddy
          </h1>
          <p className="text-xl md:text-3xl mb-10 max-w-4xl mx-auto leading-relaxed">
            The ultimate platform that connects event organizers with talented students.
            Discover skills, manage roles, and bring college events to life effortlessly.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-indigo-600 font-bold px-15 py-6 text-2xl rounded-lg hover:bg-gray-100 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent border-2 border-white px-20 py-6 text-2xl rounded-lg hover:bg-white hover:text-indigo-600 transition font-bold"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* About / Features Section */}
      <section
        ref={aboutRef}
        className="max-w-[150rem] mx-auto py-20 px-6 md:px-10 w-full"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-center text-blue-900 mb-16">
          What We Provide
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              icon: <FaUserGraduate className="text-indigo-500 text-6xl mx-auto mb-6" />,
              title: "Student Profiles",
              desc: "Showcase skills, interests, availability, and contact info of students all in one place.",
            },
            {
              icon: <FaSearch className="text-purple-500 text-6xl mx-auto mb-6" />,
              title: "Smart Search",
              desc: "Find the right student instantly for roles like host, coder, designer, dancer, and more.",
            },
            {
              icon: <FaComments className="text-pink-500 text-6xl mx-auto mb-6" />,
              title: "In-app Chat",
              desc: "Organizers and students can communicate directly for smoother coordination.",
            },
            {
              icon: <FaLightbulb className="text-yellow-500 text-6xl mx-auto mb-6" />,
              title: "Event Roles Board",
              desc: "Organizers post requirements and get matched with skilled students instantly.",
            },
            {
              icon: <FaSearch className="text-green-500 text-6xl mx-auto mb-6" />,
              title: "Recommendation System",
              desc: "AI-driven suggestions for best-fit students based on skills and past participation.",
            },
            {
              icon: <FaLightbulb className="text-red-500 text-6xl mx-auto mb-6" />,
              title: "Future Advancements",
              desc: "Leaderboards, badges, event reminders, and integration with college calendars.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow-xl rounded-2xl p-10 text-center hover:scale-105 transform transition w-full"
            >
              {item.icon}
              <h3 className="text-4xl font-bold mb-3">{item.title}</h3>
              <p className="text-2xl text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-700 text-white py-6 text-center text-2xl mt-auto w-full">
        © 2025 Smart Event Buddy. All Rights Reserved.
      </footer>
    </div>
  );
}
