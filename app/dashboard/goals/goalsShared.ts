export interface GoalRow {
    id: number;
    title: string;
    goal_type: string;
    target_value: string | number;
    current_value: string | number;
    unit: string;
    period_type: string;
    start_date: string;
    end_date: string | null;
    status: string;
    notes: string | null;
    completed_at?: string | null;
    show_in_calendar?: boolean | number;
    show_in_dashboard?: boolean | number;
}

export type GoalTypeOption = { value: string; label: string };

export const goalTypeOptions: GoalTypeOption[] = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'body_fat', label: 'Body Fat' },
    { value: 'steps', label: 'Steps' },
    { value: 'workouts', label: 'Workouts' },
    { value: 'strength', label: 'Strength' },
    { value: 'endurance', label: 'Endurance' },
    { value: 'calories_burned', label: 'Calories Burned' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'protein', label: 'Protein' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'hydration', label: 'Hydration' },
    { value: 'habit_streak', label: 'Habit Streak' },
    { value: 'event_prep', label: 'Event Prep' },
    { value: 'custom', label: 'Custom' },
];

export const periodTypeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' },
];

export const goalsSWRKey = '/api/get-goals';

export const goalsFetcher = async (url: string): Promise<GoalRow[]> => {
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch goals');
    return response.json();
};

export const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
