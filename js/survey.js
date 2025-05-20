// /js/survey.js
import { generatePersonalPlan } from './planEngine.js';

let currentStep = 0;
const formSteps = document.querySelectorAll(".form-step");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const progress = document.getElementById("progress");
const form = document.getElementById("surveyForm");

function showStep(index) {
  formSteps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });
  prevBtn.style.display = index === 0 ? "none" : "inline-block";
  nextBtn.style.display = index < formSteps.length - 1 ? "inline-block" : "none";
  submitBtn.style.display = index === formSteps.length - 1 ? "inline-block" : "none";
  progress.style.width = `${((index + 1) / formSteps.length) * 100}%`;
}

nextBtn.addEventListener("click", () => {
  const inputs = formSteps[currentStep].querySelectorAll("input[required], select[required], textarea[required]");
  const valid = Array.from(inputs).every(i => i.checkValidity());
  if (valid) {
    currentStep++;
    showStep(currentStep);
  } else {
    form.reportValidity();
  }
});

prevBtn.addEventListener("click", () => {
  currentStep--;
  showStep(currentStep);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // 1. Collect survey data
  const formData = new FormData(form);
  const surveyData = {};
  formData.forEach((value, key) => {
    surveyData[key] = value.trim();
  });

  // 2. Save survey data
  localStorage.setItem("auraSurvey", JSON.stringify(surveyData));

  // 3. Generate & save plan
  const plan = generatePersonalPlan({
    ...surveyData,
    // Convert numeric fields
    age: Number(surveyData.age),
    height: Number(surveyData.height),
    weight: Number(surveyData.weight)
  });
  localStorage.setItem("auraPlan", JSON.stringify(plan));

  // 4. Redirect
  window.location.href = "dashboard.html";
});

showStep(currentStep);
