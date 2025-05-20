import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "firebase/auth";
import { generatePersonalPlan } from './planEngine.js';

function safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function updateUserName(name) {
  document.querySelectorAll('.user-name').forEach(el => {
    el.textContent = ` ${name}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const todayWorkout = document.getElementById('todayWorkout');
  const todayDiet = document.getElementById('todayDiet');
  const userBMI = document.getElementById('userBMI');
  const tipOfDay = document.getElementById('tipOfDay');

  let survey = safeJSONParse(localStorage.getItem('auraSurvey'));
  let plan = safeJSONParse(localStorage.getItem('auraPlan'));

  if (!survey || !plan) {
    alert('No user session or plan data found. Please sign up or log in.');
    window.location.href = 'login.html';
    return;
  }

  if (!plan.weekMeals || !plan.workouts) {
    plan = generatePersonalPlan({
      ...survey,
      age: Number(survey.age),
      height: Number(survey.height),
      weight: Number(survey.weight)
    });
    localStorage.setItem('auraPlan', JSON.stringify(plan));
  }

  const name = survey.name || 'User';
  updateUserName(name);

  userBMI.textContent = plan.bmi || 'N/A';

  const dayIndex = ((new Date()).getDay() + 6) % 7; // Adjust so Monday = 0
  const todayPlan = plan.weekMeals[dayIndex];
  const todayWorkoutArr = plan.workouts[dayIndex]?.exercises || [];

  todayWorkout.textContent = ${plan.workouts[dayIndex]?.dayType || 'Workout'}: ${todayWorkoutArr.join(', ') || 'Rest'};
  todayDiet.textContent =
    `BF: ${todayPlan.breakfast?.name || 'N/A'}, ` +
    `Lunch: ${todayPlan.lunch?.name || 'N/A'}, ` +
    `Dinner: ${todayPlan.dinner?.name || 'N/A'}, ` +
    Snack: ${todayPlan.snack?.name || 'N/A'};

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

  const chartCanvas = document.getElementById('progressChart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const displayName = user.displayName || 'User';
      updateUserName(displayName);

      let updatedSurvey = safeJSONParse(localStorage.getItem('auraSurvey'));
      let updatedPlan = safeJSONParse(localStorage.getItem('auraPlan'));

      if (!updatedSurvey || !updatedPlan || !updatedPlan.weekMeals || !updatedPlan.workouts) {
        updatedSurvey = updatedSurvey || { name: displayName };
        updatedPlan = generatePersonalPlan({
          ...updatedSurvey,
          age: Number(updatedSurvey.age) || 25,
          height: Number(updatedSurvey.height) || 170,
          weight: Number(updatedSurvey.weight) || 70
        });
        localStorage.setItem('auraSurvey', JSON.stringify(updatedSurvey));
        localStorage.setItem('auraPlan', JSON.stringify(updatedPlan));
      }
    }
  });
});
