import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { plansAPI } from "../services/api";
import PlanCard from "../components/PlanCard";

// Landing Page Component
export default function LandingPage() {
  const [plans, setPlans] = useState([]); // State to store all fitness plans
  const navigate = useNavigate(); // Hook to navigate between routes

  // Fetch all plans on page load
  useEffect(() => {
    plansAPI
      .getAllPlans()
      .then((res) => setPlans(res.data)) // Store plans in state
      .catch((err) => console.error(err)); // Log errors if API fails
  }, []);

  const handleViewDetails = (plan) => {
    navigate(`/plan/${plan._id}`, { state: { plan } });
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to FitPlanHub</h1>
          <p>Discover personalized fitness plans from certified trainers</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Get Started
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="plans-section">
        <div className="container">
          <h2>Explore Fitness Plans</h2>
          <p>Choose from a variety of plans tailored to your fitness goals</p>

          <div className="plans-grid">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onSubscribe={() => navigate("/login")}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
