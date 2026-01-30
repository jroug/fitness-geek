// src/types/global.d.ts

// Ensure TypeScript recognizes this file as a global module
export {};

declare global {

    interface CustomToolBarProps {
        label: string;
        date: Date;
        onNavigate: (action: NavigateAction) => void;
        onView: (view: View) => void;
        calcAverageWeeklyWeight: (startDate: Date) => string;
        calcNumberOfWeeklyWorkouts: (startDate: Date) => string;
    }

    interface CustomPublicToolBarProps {
        label: string;
        onNavigate: (action: NavigateAction) => void;
        onView: (view: View) => void;
    }
    
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
        user_id: number;
        date_of_comment: string | Date;
        comment: string;
        grade: number;
    }

    // Define interfaces for meal data
    interface MealSuggestion {
        id: string;
        food_name: string;
        calories: string;
        protein: string;
        carbohydrates: string;
        fat: string;
        fiber: string;
        category: string;
        serving_size: string;
        comments: string;
    }

    interface MealInputData {
        datetime_of_meal: string;
        meal_id: string;
        meal_quantity: number;
        meal_quantity_type: string;
        comments: string;
    }

    interface UserWeighingData {
        id: string;
        weight: number;
        date_of_weighing: string;
    }

    interface UserWorkoutData {
        date_of_workout: string | Date;
        w_title: string;
        w_type: string;
        w_calories: number;
        w_time: number;
    }