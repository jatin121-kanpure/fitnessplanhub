import React, { useEffect, useState } from "react";
import { feedAPI, subscriptionsAPI, trainersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PlanCard from "../components/PlanCard";

// User Feed Component
export default function UserFeed() {
  const [feed, setFeed] = useState([]); // Plans from followed trainers
  const [trainers, setTrainers] = useState([]); // All trainers for recommendations
  const { user } = useAuth(); // Logged-in user info

  // Fetch feed and trainers on page load
  useEffect(() => {
    // Get personalized feed
    feedAPI
      .getPersonalizedFeed()
      .then((res) => setFeed(res.data))
      .catch((err) => console.error(err));

    // Get all trainers for recommendations
    trainersAPI
      .getAllTrainers()
      .then((res) => setTrainers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Subscribe to a plan
  const handleSubscribe = async (planId) => {
    try {
      await subscriptionsAPI.subscribeToPlan(planId);
      alert("Successfully subscribed!");

      // Refresh feed to update subscription status
      feedAPI.getPersonalizedFeed().then((res) => setFeed(res.data));
    } catch (err) {
      alert(err.response?.data?.message || "Subscription failed");
    }
  };

  // Follow a trainer
  const handleFollowTrainer = async (trainerId) => {
    try {
      await trainersAPI.followTrainer(trainerId);
      alert("Trainer followed!");

      // Refresh feed to show new trainer's plans
      feedAPI.getPersonalizedFeed().then((res) => setFeed(res.data));
    } catch (err) {
      alert("Already following or error occurred");
    }
  };

  return (
    <div className="container">
      <h1>Your Personalized Feed</h1>

      {/* Recommended Trainers Section */}
      <div className="section">
        <h2>Recommended Trainers</h2>
        <div className="trainers-grid">
          {trainers.map((trainer) => (
            <div key={trainer._id} className="trainer-card">
              <h3>{trainer.userId.name}</h3>
              <p>{trainer.certification}</p>
              <p>Plans: {trainer.plans.length}</p>
              <button onClick={() => handleFollowTrainer(trainer._id)}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Plans from Followed Trainers Section */}
      <div className="section">
        <h2>Plans from Your Followed Trainers</h2>

        {feed.length === 0 ? (
          <p>Follow trainers to see their plans</p>
        ) : (
          <div className="plans-grid">
            {feed.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onSubscribe={handleSubscribe}
                onFollowTrainer={handleFollowTrainer}
                isSubscribed={plan.isSubscribed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
