// utils/mealMapper.ts

export function mealTypeOptions(code: string): string {
    const mealTypeOpts: { [key: string]: string } = {
        "B": "Breakfast",
        "MS": "Morning Snack",
        "L": "Lunch",
        "AS": "Afternoon Snack",
        "D": "Dinner",
        "PW": "Post Workout",
        "OTH": "Other"
    };
    return mealTypeOpts[code] || "Unknown meal"; // Default to "Unknown meal" if code isn't found
}
