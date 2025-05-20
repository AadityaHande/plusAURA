// js/dashboard.js
import { generatePersonalPlan } from './planEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const userNameNav   = document.getElementById('userNameNav');
  const userNameHero  = document.getElementById('userNameHero');
  const todayWorkout  = document.getElementById('todayWorkout');
  const todayDiet     = document.getElementById('todayDiet');
  const userBMI       = document.getElementById('userBMI');
  const tipOfDay      = document.getElementById('tipOfDay');
  const logoutBtn     = document.getElementById('logoutBtn');

  // Load from localStorage
  const survey = JSON.parse(localStorage.getItem('auraSurvey'));
  let plan     = JSON.parse(localStorage.getItem('auraPlan'));

  if (!survey || !plan) {
    alert('No user session or plan data found. Please sign up or log in.');
    window.location.href = 'login.html';
    return;
  }

  // If plan missing (edge case), regenerate
  if (!plan.weekMeals) {
    plan = generatePersonalPlan({
      ...survey,
      age: Number(survey.age),
      height: Number(survey.height),
      weight: Number(survey.weight)
    });
  }

  // Display user name
  const name = survey.name || 'Rahul';
  const first = name.split(' ')[0];
  userNameNav.textContent  = ` ${first}`;
  userNameHero.textContent = first;

  // Display BMI
  userBMI.textContent = plan.bmi;

  // Determine today index
  const todayIndex = (new Date()).getDay(); // 0=Sunday,1=Mon...
  // Adjust so Day 1 → Monday; if Sunday (0), use last element
  const idx = todayIndex === 0 ? 6 : todayIndex - 1;

  // Show today’s workout & diet
  const todayPlan = plan.weekMeals[idx];
  const todayWorkoutArr = plan.workouts[idx].exercises;
  todayWorkout.textContent = `${plan.workouts[idx].dayType}: ${todayWorkoutArr.join(', ')}`;
  todayDiet.textContent    = `BF: ${todayPlan.breakfast.name}, Lunch: ${todayPlan.lunch.name}, Dinner: ${todayPlan.dinner.name}, Snack: ${todayPlan.snack.name}`;

  // Tip of the day (random)
  const tips = [
    'Hydrate before, during, and after workouts.',
    'Aim for 7–9 hours of sleep tonight.',
    'Consistency beats intensity—stick to your plan!',
    'Increase protein intake for muscle recovery.',
    'Warm up properly to avoid injuries.',
    'Small progress is still progress—keep going!',
    'Track your meals for better results.'
  ];
  tipOfDay.textContent = tips[Math.floor(Math.random() * tips.length)];

  // Progress Chart (dummy data or store real data similarly)
  const ctx = document.getElementById('progressChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Workout Completion %',
        data: [80, 70, 85, 60, 90, 75, 50],
        borderColor: '#ff5722',
        backgroundColor: 'rgba(255,87,34,0.2)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });

  // Logout handler
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('auraSurvey');
    localStorage.removeItem('auraPlan');
    window.location.href = 'login.html';
  });
});
