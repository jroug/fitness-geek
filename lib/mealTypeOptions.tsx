// utils/mealMapper.ts

export const mealTypeOpts = [
    { key: "B", label: "Breakfast" },
    { key: "MS", label: "Morning Snack" },
    { key: "L", label: "Lunch" },
    { key: "AS", label: "Afternoon Snack" },
    { key: "PW", label: "Post Workout" },
    { key: "D", label: "Dinner" },
    { key: "OTH", label: "Other" }
] as const;

export function mealTypeOptions(code: string): string {
    const meal = mealTypeOpts.find(item => item.key === code);
    return meal ? meal.label : "Unknown meal";
}
