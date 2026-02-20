// src/types/global.d.ts

// Ensure TypeScript recognizes this file as a global module
export {};

declare global {

    interface ProfileData  { 
        message: string;
        user_name: string;
        first_name: string;
        last_name: string;
        user_registered: string;
        email: string;
        date_of_birth?: string;
        profile_picture?: string;
 
    }

    interface ProfileDataWithStats { 
        message: string;
        user_name: string;
        first_name: string;
        last_name: string;
        user_registered: string;
        email: string;
        date_of_birth?: string;
        profile_picture?: string;
        fitness_stats?: {
            last_weighing?: number;
            last_weighing_date?: string;
            last_weekly_avg_weight?: number;
            this_weekly_avg_weight?: number;
            weekly_workouts_count?: number;
            this_week_avg_grade?: number;

            bodycomp_date?: Date;
            bodycomp_fat_percent?: number;
            bodycomp_fat?: number;
            bodycomp_fat_visceral?: number;
            bodycomp_muscle?: number;
            bodycomp_waist?: number;
            bodycomp_weight?: number;
        }
    }
 

    interface CustomToolBarProps {
        label: string;
        date: Date;
        onNavigate: (action: NavigateAction) => void;
        onView: (view: View) => void;
        calcWeeklyGrades: (startDate: Date) => { avg: string; total: string; };
        calcAverageWeeklyWeight: (startDate: Date) => string;
        calcNumberOfWeeklyWorkouts: (startDate: Date) => string;
        generateWeeklyExportData: (startDate: Date) => {
            weekTitle: string;
            summary: {
                score: string;
                avgGrade: string;
                avgWeight: string;
                workouts: string;
            };
            days: Array<{
                date: string;
                grade: string;
                comment: string;
                weight: string;
                workout: string;
                meals: Array<{
                    slot: string;
                    items: string[];
                }>;
            }>;
        };
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
        portion_quantity?: number;
        portion_quantity_type?: string;
        serving_size?: number;
        calories?: number;
        protein?: number;
        carbohydrates?: number;
        fat?: number;
        fiber?: number;
    }

    interface MealGrouped {
        id: string;
        start: Date;
        end: Date;
        title: string;
        category: string;
        comments: string;
        portion_quantity?: number;
        portion_quantity_type?: string;
        serving_size?: number;
        calories?: number;
        protein?: number;
        carbohydrates?: number;
        fat?: number;
        fiber?: number;
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
        calories?: number | string;
        protein?: number | string;
        carbohydrates?: number | string;
        fat?: number | string;
        fiber?: number | string;
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
        w_description?: string;
        w_type: string;
        w_calories?: string;
        w_time?: string;
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

    interface UserBodyfatData {
        id: string | number;
        measurement_date: string;
        weight_kg: number | null;
        bmi: number | null;
        body_fat_percent: number | null;
        body_fat_kg: number | null;
        lean_body_mass_kg: number | null;
        muscle_mass_kg: number | null;
        total_body_water_percent: number | null;
        waist_circumference_cm: number | null;
        visceral_fat: number | null;
    }

    interface UserWorkoutDataForChart { 
        date_of_workout: string | Date;
        w_title?: string;
        w_type?: string;
        w_calories?: number;
        w_time: number;
    }

    interface UserGradeDataForChart {
        date_of_comment: string | Date;
        grade: number;
    }
 
    type MealApiItem = {
      id: string;
      f_title: string;
      f_category: string;
      f_comments: string;
    };
    
    type MealEventLike = {
      id?: string;
      title?: string;
      start: Date | string;
      end: Date | string;
      meals?: MealApiItem[];
    };
    
}
