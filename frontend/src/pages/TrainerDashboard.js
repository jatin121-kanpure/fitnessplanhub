import React, { useEffect, useState } from "react";
import { plansAPI } from "../services/api";

// Trainer Dashboard Component
export default function TrainerDashboard() {
  // Store trainer's plans
  const [plans, setPlans] = useState([]);

  // Form data for creating a new plan
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "",
  });

  // Load trainer's plans when page loads
  useEffect(() => {
    loadPlans();
  }, []);

  // Fetch trainer's own plans
  const loadPlans = async () => {
    try {
      const res = await plansAPI.getTrainerPlans();
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to load plans");
    }
  };

  //Create new plan
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await plansAPI.createPlan(formData);

      // Clear form after success
      setFormData({
        title: "",
        description: "",
        price: "",
        duration: "",
        category: "",
      });

      loadPlans();
      alert("Plan created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create plan");
    }
  };

  // Delete a plan
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this plan?");

    if (!confirmDelete) return;

    try {
      await plansAPI.deletePlan(id);
      loadPlans();
      alert("Plan deleted!");
    } catch (err) {
      alert("Failed to delete plan");
    }
  };

  return (
    <div className="container">
      <h1>Trainer Dashboard</h1>

      {/* CREATE PLAN SECTION */}
      <div className="form-section">
        <h2>Create New Plan</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Plan Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter plan title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe the plan"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              id="price"
              type="number"
              placeholder="Enter price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              type="text"
              placeholder="e.g., 30 days"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              placeholder="e.g., Weight Loss, Yoga"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          <button type="submit" className="btn-primary">
            Create Plan
          </button>
        </form>
      </div>

      {/* MY PLANS SECTION */}
      <div className="plans-section">
        <h2>My Plans</h2>

        {plans.length === 0 ? (
          <p>No plans created yet</p>
        ) : (
          plans.map((plan) => (
            <div key={plan._id} className="plan-item">
              <h3>{plan.title}</h3>
              <p>{plan.description.substring(0, 100)}...</p>
              <p>
                <strong>Price:</strong> ₹{plan.price} |{" "}
                <strong>Duration:</strong> {plan.duration}
              </p>
              <button
                className="btn-danger"
                onClick={() => handleDelete(plan._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
