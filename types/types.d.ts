// src/types/global.d.ts

// Ensure TypeScript recognizes this file as a global module
export {};

declare global {

    interface Meals{
        id: string;
        f_title: string;
        f_category: string;
    }

    interface MealGrouped {
        id: string;
        start: Date;
        end: Date;
        title: string;
        category: string;
    }

    interface MealEvent {
        id: string;
        title: string;
        start: Date;
        end: Date;
        meals: Meals[];
    }

    interface CalendarData {
        user_display_name?: string;
        meals_list: UserMealData[];
        weight_list: UserWeightData[];
        workout_list: UserWorkoutData[];
    }

    interface UserMealData {
        ID: number;
        datetime_of_meal: string | Date;
        food_name: string;
        category: string;
        serving_size: number;
        meal_quantity: number;
        meal_quantity_type: string;
    }

    interface UserWeightData {
        id: number;
        date_of_weighing: string | Date;
        weight: string;
    }

    interface UserWorkoutData {
        id: number;
        date_of_workout: string | Date;
        w_title: string;
        w_type: string;
    }

}