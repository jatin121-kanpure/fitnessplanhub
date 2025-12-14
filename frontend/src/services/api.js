// Import Axios for HTTP requests
import axios from "axios";

// Create an Axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

//Add Auth Token to request headers
API.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = localStorage.getItem("token");

  // If token exists, add it to request headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//Auth related API calls
export const authAPI = {
  signup: (data) => API.post("/auth/signup", data),
  login: (data) => API.post("/auth/login", data),
  getCurrentUser: () => API.get("/auth/me"),
};

//Plan related API calls
export const plansAPI = {
  getAllPlans: () => API.get("/plans"),
  getPlanById: (id) => API.get(`/plans/${id}`),
  createPlan: (data) => API.post("/plans/create", data),
  updatePlan: (id, data) => API.put(`/plans/${id}`, data),
  deletePlan: (id) => API.delete(`/plans/${id}`),
  getTrainerPlans: () => API.get("/plans/trainer/myplans"),
};

//Trainer related API calls
export const trainersAPI = {
  getAllTrainers: () => API.get("/trainers"),
  getTrainerById: (id) => API.get(`/trainers/${id}`),
  followTrainer: (trainerId) => API.post("/trainers/follow", { trainerId }),
  unfollowTrainer: (trainerId) => API.post("/trainers/unfollow", { trainerId }),
};

//Subscription related API calls
export const subscriptionsAPI = {
  subscribeToPlan: (planId) => API.post("/subscriptions/subscribe", { planId }),
  getUserSubscriptions: () => API.get("/subscriptions/my-subscriptions"),
  checkAccess: (planId) => API.get(`/subscriptions/check-access/${planId}`),
};

//Feed related API calls
export const feedAPI = {
  getPersonalizedFeed: () => API.get("/feed"),
};

// Export default API instance
export default API;
