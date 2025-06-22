// src/types/global.d.ts

// Ensure TypeScript recognizes this file as a global module
export {};

declare global {

    interface Meals{
        id: string;
        f_title: string;
        f_category: string;
        f_comments: string;
    }

    interface MealGrouped {
        id: string;
        start: Date;
        end: Date;
        title: string;
        category: string;
        comments: string;
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
        comments_list: UserCommentData[];
    }

    interface UserMealData {
        ID: number;
        datetime_of_meal: string | Date;
        food_name: string;
        category: string;
        serving_size: number;
        meal_quantity: number;
        meal_quantity_type: string;
        comments: string;
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

    interface UserCommentData {
        id: number;
        date_of_comment: string | Date;
        comment: string;
    }

}