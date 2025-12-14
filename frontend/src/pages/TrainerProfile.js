import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { trainersAPI, plansAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PlanCard from "../components/PlanCard";

export default function TrainerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trainer, setTrainer] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadTrainerData();
  }, [id]);

  const loadTrainerData = async () => {
    try {
      setLoading(true);
      const trainerRes = await trainersAPI.getTrainerById(id);
      setTrainer(trainerRes.data);

      // Check if current user is following this trainer
      if (user && user.followedTrainers) {
        setIsFollowing(user.followedTrainers.includes(id));
      }

      // Load trainer's plans
      const plansRes = await plansAPI.getAllPlans();
      const trainerPlans = plansRes.data.filter(
        (plan) => plan.trainerId._id === id
      );
      setPlans(trainerPlans);
    } catch (err) {
      setError("Failed to load trainer profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowTrainer = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (isFollowing) {
        await trainersAPI.unfollowTrainer(id);
        setIsFollowing(false);
        alert("Unfollowed trainer");
      } else {
        await trainersAPI.followTrainer(id);
        setIsFollowing(true);
        alert("Following trainer!");
      }
    } catch (err) {
      alert("Error updating follow status");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading trainer profile...</p>
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div className="container">
        <p className="error">{error || "Trainer not found"}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="trainer-profile">
        <div className="trainer-header">
          <div className="trainer-info">
            <h1>{trainer.userId.name}</h1>
            <p className="trainer-role">Fitness Trainer</p>
            {trainer.certification && (
              <p className="trainer-cert">
                📜 <strong>Certification:</strong> {trainer.certification}
              </p>
            )}
            <div className="trainer-stats">
              <span>{trainer.plans.length} Plans</span>
              <span>{trainer.followers.length} Followers</span>
            </div>
          </div>

          {user && user._id !== trainer.userId._id && (
            <button
              className={`btn-primary ${isFollowing ? "following" : ""}`}
              onClick={handleFollowTrainer}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        <div className="trainer-plans">
          <h2>Fitness Plans by {trainer.userId.name}</h2>

          {plans.length === 0 ? (
            <p>This trainer hasn't created any plans yet.</p>
          ) : (
            <div className="plans-grid">
              {plans.map((plan) => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  onSubscribe={
                    user ? (planId) => navigate(`/plan/${planId}`) : null
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
