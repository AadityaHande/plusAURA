// /js/planEngine.js

// Detailed meal database (~10 items per category; extend to 30–40 each as needed)
const MEALS = {
  breakfast: [
    { name: 'Oatmeal with Berries', cal: 350, protein: 12, carbs: 50, fat: 8, tags: ['vegetarian', 'balanced'] },
    { name: 'Egg & Avocado Toast', cal: 400, protein: 18, carbs: 30, fat: 20, tags: ['balanced'] },
    { name: 'Greek Yogurt Parfait', cal: 300, protein: 20, carbs: 35, fat: 5, tags: ['vegetarian'] },
    { name: 'Vegan Smoothie Bowl', cal: 380, protein: 10, carbs: 60, fat: 10, tags: ['vegan'] },
    { name: 'Protein Pancakes', cal: 420, protein: 25, carbs: 45, fat: 10, tags: ['balanced'] },
    { name: 'Chia Seed Pudding', cal: 330, protein: 8, carbs: 40, fat: 15, tags: ['vegan', 'vegetarian'] },
    { name: 'Spinach Frittata', cal: 360, protein: 22, carbs: 10, fat: 25, tags: ['balanced'] },
    { name: 'Tofu Scramble', cal: 340, protein: 18, carbs: 20, fat: 18, tags: ['vegan'] },
    { name: 'Quinoa Porridge', cal: 370, protein: 12, carbs: 55, fat: 8, tags: ['vegan', 'vegetarian'] },
    { name: 'Breakfast Burrito', cal: 450, protein: 22, carbs: 50, fat: 18, tags: ['balanced'] }
  ],
  lunch: [
    { name: 'Grilled Chicken Salad', cal: 450, protein: 35, carbs: 25, fat: 20, tags: ['balanced'] },
    { name: 'Quinoa & Black Bean Bowl', cal: 500, protein: 20, carbs: 60, fat: 15, tags: ['vegan', 'vegetarian'] },
    { name: 'Salmon & Veggies', cal: 550, protein: 40, carbs: 20, fat: 30, tags: ['balanced'] },
    { name: 'Tofu Stir‑Fry', cal: 480, protein: 25, carbs: 50, fat: 18, tags: ['vegan'] },
    { name: 'Turkey Wrap', cal: 430, protein: 30, carbs: 35, fat: 15, tags: ['balanced'] },
    { name: 'Lentil Soup', cal: 320, protein: 18, carbs: 45, fat: 8, tags: ['vegan', 'vegetarian'] },
    { name: 'Shrimp Tacos', cal: 500, protein: 30, carbs: 40, fat: 22, tags: ['balanced'] },
    { name: 'Chicken Quinoa Bowl', cal: 520, protein: 38, carbs: 45, fat: 18, tags: ['balanced'] },
    { name: 'Veggie Burger', cal: 470, protein: 20, carbs: 50, fat: 20, tags: ['vegan', 'vegetarian'] },
    { name: 'Poke Bowl', cal: 540, protein: 35, carbs: 60, fat: 20, tags: ['balanced'] }
  ],
  dinner: [
    { name: 'Beef Stir‑Fry', cal: 600, protein: 45, carbs: 40, fat: 25, tags: ['balanced'] },
    { name: 'Zucchini Noodles & Pesto', cal: 400, protein: 15, carbs: 30, fat: 25, tags: ['vegetarian'] },
    { name: 'Vegan Lentil Stew', cal: 520, protein: 25, carbs: 55, fat: 15, tags: ['vegan'] },
    { name: 'Grilled Shrimp & Quinoa', cal: 530, protein: 35, carbs: 45, fat: 18, tags: ['balanced'] },
    { name: 'Baked Salmon & Asparagus', cal: 580, protein: 40, carbs: 20, fat: 30, tags: ['balanced'] },
    { name: 'Tofu Curry', cal: 550, protein: 22, carbs: 60, fat: 20, tags: ['vegan'] },
    { name: 'Chicken Alfredo', cal: 620, protein: 38, carbs: 50, fat: 28, tags: ['balanced'] },
    { name: 'Stuffed Peppers', cal: 480, protein: 25, carbs: 40, fat: 18, tags: ['vegetarian'] },
    { name: 'Steak & Veggies', cal: 650, protein: 50, carbs: 30, fat: 35, tags: ['balanced'] },
    { name: 'Eggplant Parmesan', cal: 500, protein: 20, carbs: 45, fat: 22, tags: ['vegetarian'] }
  ],
  snacks: [
    { name: 'Protein Shake', cal: 200, protein: 25, carbs: 10, fat: 5, tags: ['balanced'] },
    { name: 'Mixed Nuts', cal: 250, protein: 8, carbs: 10, fat: 20, tags: ['vegan'] },
    { name: 'Apple & Peanut Butter', cal: 220, protein: 6, carbs: 30, fat: 10, tags: ['vegetarian'] },
    { name: 'Veggies & Hummus', cal: 180, protein: 6, carbs: 20, fat: 8, tags: ['vegan'] },
    { name: 'Greek Yogurt', cal: 150, protein: 15, carbs: 12, fat: 4, tags: ['vegetarian'] },
    { name: 'Protein Bar', cal: 230, protein: 20, carbs: 25, fat: 7, tags: ['balanced'] },
    { name: 'Cheese & Crackers', cal: 260, protein: 12, carbs: 20, fat: 15, tags: ['vegetarian'] },
    { name: 'Edamame', cal: 190, protein: 17, carbs: 15, fat: 8, tags: ['vegan'] },
    { name: 'Rice Cakes & Almond Butter', cal: 210, protein: 6, carbs: 30, fat: 8, tags: ['vegan'] },
    { name: 'Beef Jerky', cal: 180, protein: 20, carbs: 8, fat: 8, tags: ['balanced'] }
  ]
};

// Workout routines for Push/Pull/Leg/Rest cycle
const WORKOUT_CYCLE = ['Push Day','Pull Day','Leg Day','Rest Day'];
const WORKOUT_ROUTINES = {
  'Push Day': ['Bench Press','Overhead Press','Tricep Dips','Push‑Ups'],
  'Pull Day': ['Pull‑Ups','Bent‑Over Rows','Bicep Curls','Face Pulls'],
  'Leg Day': ['Squats','Deadlifts','Lunges','Leg Press'],
  'Rest Day': ['Rest or Light Stretching']
};

// Utility to filter meals
function filterMeals(arr, dietType, exclusions=[]) {
  return arr.filter(m => {
    if (dietType==='Vegan' && !m.tags.includes('vegan')) return false;
    if (dietType==='Vegetarian' && !m.tags.includes('vegetarian')) return false;
    if (dietType==='Keto' && !m.tags.includes('keto')) return false;
    for (let ex of exclusions) {
      if (m.name.toLowerCase().includes(ex.toLowerCase())) return false;
    }
    return true;
  });
}

// Utility to choose random meal
function chooseRandom(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

// Exposed function to generate and store personal plan
export function generatePersonalPlan(surveyData) {
  const plan = generatePlan(surveyData);
  localStorage.setItem('auraPlan', JSON.stringify(plan));
  return plan;
}

// Core plan generation
function generatePlan({ height, weight, goal, activity_level, diet_type, food_exclusions=[], health_issues='' }) {
  // BMI
  const bmi = +(weight/((height/100)**2)).toFixed(1);

  // Calories + macros
  let calories = 1600 + bmi*20;
  if (goal==='Muscle Gain') calories*=1.15;
  if (goal==='Weight Loss') calories*=0.8;
  if (activity_level==='Light') calories+=200;
  if (activity_level==='Moderate') calories+=400;
  if (activity_level==='Intense') calories+=600;
  calories = Math.round(calories);

  const proteinG = Math.round(weight*(goal==='Muscle Gain'?1.6:1.2));
  const fatG = Math.round((calories*0.25)/9);
  const carbG = Math.round((calories - (proteinG*4 + fatG*9))/4);

  // 7-day meals
  const weekMeals = [];
  for (let i=0;i<7;i++) {
    const b = filterMeals(MEALS.breakfast, diet_type, food_exclusions);
    const l = filterMeals(MEALS.lunch, diet_type, food_exclusions);
    const d = filterMeals(MEALS.dinner, diet_type, food_exclusions);
    const s = filterMeals(MEALS.snacks, diet_type, food_exclusions);
    weekMeals.push({ breakfast: chooseRandom(b), lunch: chooseRandom(l), dinner: chooseRandom(d), snack: chooseRandom(s) });
  }

  // 7-day workouts
  const workouts = [];
  for (let d=0;d<7;d++) {
    const dayType = WORKOUT_CYCLE[d%WORKOUT_CYCLE.length];
    workouts.push({ dayType, exercises: WORKOUT_ROUTINES[dayType] });
  }

  // Health considerations
  const health = [];
  if (health_issues.toLowerCase().includes('diabetes')) health.push('Limit sugars');
  if (health_issues.toLowerCase().includes('hypertension')) health.push('Low‑sodium diet');
  if (health_issues.toLowerCase().includes('asthma')) health.push('Include breathing exercises');

  return { bmi, calories, macros: { proteinG, carbG, fatG }, weekMeals, workouts, healthConsiderations: health };
}
