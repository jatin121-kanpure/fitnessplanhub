import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { plansAPI, subscriptionsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function PlanDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(location.state?.plan || null);
  const [loading, setLoading] = useState(!plan);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!plan) {
      loadPlan();
    } else {
      checkSubscription();
    }
  }, [id, plan]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const res = await plansAPI.getPlanById(id);
      setPlan(res.data);
      checkSubscription();
    } catch (err) {
      setError("Failed to load plan details");
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;
    try {
      const res = await subscriptionsAPI.checkAccess(id);
      setSubscribed(res.data.hasAccess);
    } catch (err) {
      console.log("Not subscribed to this plan");
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await subscriptionsAPI.subscribeToPlan(id);
      setSubscribed(true);
      alert("Successfully subscribed to the plan!");
    } catch (err) {
      alert(err.response?.data?.message || "Subscription failed");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading plan details...</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="container">
        <p className="error">{error || "Plan not found"}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="plan-details">
        <div className="plan-details-header">
          <h1>{plan.title}</h1>
          {plan.category && (
            <span className="category-badge large">{plan.category}</span>
          )}
        </div>

        <div className="plan-details-content">
          <div className="details-main">
            <div className="section">
              <h2>About This Plan</h2>
              <p className="description">{plan.description}</p>
            </div>

            {plan.exercises && plan.exercises.length > 0 && (
              <div className="section">
                <h2>Exercises Included</h2>
                <div className="exercises-list">
                  {plan.exercises.map((exercise, idx) => (
                    <div key={idx} className="exercise-item">
                      <h4>{exercise.name}</h4>
                      <div className="exercise-meta">
                        <span>Sets: {exercise.sets}</span>
                        <span>Reps: {exercise.reps}</span>
                      </div>
                      {exercise.description && (
                        <p className="exercise-desc">{exercise.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="details-sidebar">
            <div className="pricing-card">
              <div className="price-tag">₹{plan.price}</div>
              <p className="price-period">One-time subscription</p>

              <div className="plan-info">
                <div className="info-row">
                  <span>Duration:</span>
                  <strong>{plan.duration}</strong>
                </div>
                {plan.exercises && (
                  <div className="info-row">
                    <span>Exercises:</span>
                    <strong>{plan.exercises.length}</strong>
                  </div>
                )}
                {plan.trainerId && (
                  <div className="info-row">
                    <span>Trainer:</span>
                    <strong>{plan.trainerId.userId?.name}</strong>
                  </div>
                )}
              </div>

              {subscribed ? (
                <button className="btn-success full" disabled>
                  ✓ You're Subscribed
                </button>
              ) : (
                <button className="btn-primary full" onClick={handleSubscribe}>
                  Subscribe Now
                </button>
              )}

              <p className="subscribe-note">
                Get full access to workout plans, exercises, and guidance from
                the trainer.
              </p>
            </div>

            {plan.trainerId && (
              <div className="trainer-card">
                <h3>About Your Trainer</h3>
                <p className="trainer-name">{plan.trainerId.userId?.name}</p>
                {plan.trainerId.certification && (
                  <p className="trainer-cert">
                    📜 <strong>Certification:</strong>{" "}
                    {plan.trainerId.certification}
                  </p>
                )}
                {plan.trainerId.specialization && (
                  <p className="trainer-spec">
                    🎯 <strong>Specialization:</strong>{" "}
                    {plan.trainerId.specialization}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
