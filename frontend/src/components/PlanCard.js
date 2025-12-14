import React from "react";
import { useNavigate } from "react-router-dom";

export default function PlanCard({
  plan,
  onSubscribe,
  onFollowTrainer,
  isSubscribed,
}) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/plan/${plan._id}`, { state: { plan } });
  };

  const handleTrainerClick = (e) => {
    e.stopPropagation();
    navigate(`/trainer/${plan.trainerId._id}`);
  };

  return (
    <div className="plan-card" onClick={handleViewDetails}>
      <div className="plan-header">
        <h3>{plan.title}</h3>
        {plan.category && (
          <span className="category-badge">{plan.category}</span>
        )}
      </div>

      <p className="plan-description">
        {plan.description.substring(0, 150)}...
      </p>

      <div className="plan-meta">
        <div className="meta-item">
          <span className="label">Duration:</span>
          <span className="value">{plan.duration}</span>
        </div>
        <div className="meta-item">
          <span className="label">Price:</span>
          <span className="value price">₹{plan.price}</span>
        </div>
      </div>

      {plan.trainerId && (
        <div className="trainer-info">
          <p className="trainer-name">
            By:{" "}
            <button className="trainer-link" onClick={handleTrainerClick}>
              {plan.trainerId.userId?.name || "Unknown Trainer"}
            </button>
          </p>
          {onFollowTrainer && (
            <button
              className="btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onFollowTrainer(plan.trainerId._id);
              }}
            >
              Follow Trainer
            </button>
          )}
        </div>
      )}

      <div className="plan-actions">
        <button className="btn-primary" onClick={handleViewDetails}>
          View Details
        </button>

        {onSubscribe &&
          (isSubscribed ? (
            <button className="btn-success" disabled>
              ✓ Subscribed
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onSubscribe(plan._id);
              }}
            >
              Subscribe
            </button>
          ))}
      </div>
    </div>
  );
}
