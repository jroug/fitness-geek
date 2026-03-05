import type { NextApiRequest, NextApiResponse } from 'next';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type GoalRow = {
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
};

type ProfileApiResponse = {
  name?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  acf?: {
    date_of_birth?: string;
  };
  fitness_stats?: {
    last_weighing?: number;
    last_weighing_date?: string;
    last_weekly_avg_weight?: number;
    this_weekly_avg_weight?: number;
    weekly_workouts_count?: number;
    this_week_avg_grade?: number;
  };
};

type CalendarApiResponse = {
  meals_list?: Array<{
    datetime_of_meal?: string;
    food_name?: string;
    category?: string;
    calories?: number | string;
    protein?: number | string;
    carbohydrates?: number | string;
    fat?: number | string;
    fiber?: number | string;
  }>;
  weight_list?: Array<{
    date_of_weighing?: string;
    weight?: number | string;
  }>;
  workout_list?: Array<{
    date_of_workout?: string;
    w_title?: string;
    w_type?: string;
    w_time?: number | string;
    w_calories?: number | string;
  }>;
  comments_list?: Array<{
    date_of_comment?: string;
    grade?: number | string;
    comment?: string;
  }>;
};

type DailyContext = {
  date: string;
  mealCount: number;
  workoutCount: number;
  weight: number | null;
  grade: number | null;
  comment: string | null;
  meals: string[];
  workouts: string[];
  macros: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
};

type ChatContextApiResponse = {
  profile?: ProfileApiResponse;
  goals?: GoalRow[];
  calendar?: CalendarApiResponse;
};

const extractOutputText = (data: unknown): string => {
  const payload = data as {
    output_text?: unknown;
    output?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  if (typeof payload.output_text === 'string' && payload.output_text.trim().length > 0) {
    return payload.output_text.trim();
  }

  if (!Array.isArray(payload.output)) return '';

  return payload.output
    .flatMap((item) => (Array.isArray(item.content) ? item.content : []))
    .filter((part) => part?.type === 'output_text' && typeof part.text === 'string')
    .map((part) => String(part.text))
    .join('\n')
    .trim();
};

const toDateKey = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split('T')[0];
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const safeString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

const daysAgoDateKey = (daysAgo: number): string => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const buildCalendarContext = (calendar: CalendarApiResponse): DailyContext[] => {
  const startDate = daysAgoDateKey(30);
  const daily: Record<string, DailyContext> = {};

  const ensureDay = (dateKey: string): DailyContext => {
    if (!daily[dateKey]) {
      daily[dateKey] = {
        date: dateKey,
        mealCount: 0,
        workoutCount: 0,
        weight: null,
        grade: null,
        comment: null,
        meals: [],
        workouts: [],
        macros: { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0 },
      };
    }
    return daily[dateKey];
  };

  for (const meal of calendar.meals_list || []) {
    const dateKey = toDateKey(meal.datetime_of_meal);
    if (!dateKey || dateKey < startDate) continue;
    const day = ensureDay(dateKey);
    day.mealCount += 1;
    if (day.meals.length < 8) {
      const foodName = safeString(meal.food_name, 'Food');
      const category = safeString(meal.category);
      day.meals.push(category ? `${foodName} (${category})` : foodName);
    }
    day.macros.calories += toNumber(meal.calories);
    day.macros.protein += toNumber(meal.protein);
    day.macros.carbohydrates += toNumber(meal.carbohydrates);
    day.macros.fat += toNumber(meal.fat);
    day.macros.fiber += toNumber(meal.fiber);
  }

  for (const workout of calendar.workout_list || []) {
    const dateKey = toDateKey(workout.date_of_workout);
    if (!dateKey || dateKey < startDate) continue;
    const day = ensureDay(dateKey);
    day.workoutCount += 1;
    if (day.workouts.length < 6) {
      const title = safeString(workout.w_title, 'Workout');
      const type = safeString(workout.w_type);
      day.workouts.push(type ? `${title} (${type})` : title);
    }
  }

  for (const weight of calendar.weight_list || []) {
    const dateKey = toDateKey(weight.date_of_weighing);
    if (!dateKey || dateKey < startDate) continue;
    const day = ensureDay(dateKey);
    day.weight = toNumber(weight.weight);
  }

  for (const comment of calendar.comments_list || []) {
    const dateKey = toDateKey(comment.date_of_comment);
    if (!dateKey || dateKey < startDate) continue;
    const day = ensureDay(dateKey);
    const gradeValue = toNumber(comment.grade);
    day.grade = gradeValue > 0 ? gradeValue : null;
    day.comment = safeString(comment.comment, '').trim() || null;
  }

  return Object.values(daily).sort((a, b) => a.date.localeCompare(b.date));
};

const buildDataContext = (
  profile: ProfileApiResponse | null,
  goals: GoalRow[],
  calendar: CalendarApiResponse | null,
) => {
  const calendarDays = calendar ? buildCalendarContext(calendar) : [];
  const activeGoals = goals.filter((goal) => safeString(goal.status).toLowerCase() === 'active');

  const dailyGoals = activeGoals
    .filter((goal) => safeString(goal.period_type).toLowerCase() === 'daily')
    .map((goal) => ({
      title: goal.title,
      target: `${goal.target_value}${goal.unit ? ` ${goal.unit}` : ''}`,
      current: goal.current_value,
      startDate: goal.start_date,
      endDate: goal.end_date,
      notes: goal.notes || '',
    }));

  const weeklyGoals = activeGoals
    .filter((goal) => safeString(goal.period_type).toLowerCase() === 'weekly')
    .map((goal) => ({
      title: goal.title,
      target: `${goal.target_value}${goal.unit ? ` ${goal.unit}` : ''}`,
      current: goal.current_value,
      startDate: goal.start_date,
      endDate: goal.end_date,
      notes: goal.notes || '',
    }));

  const totalWorkouts = calendarDays.reduce((sum, day) => sum + day.workoutCount, 0);
  const totalMeals = calendarDays.reduce((sum, day) => sum + day.mealCount, 0);
  const gradeDays = calendarDays.filter((day) => typeof day.grade === 'number');
  const avgGrade =
    gradeDays.length > 0
      ? Math.round((gradeDays.reduce((sum, day) => sum + (day.grade || 0), 0) / gradeDays.length) * 10) / 10
      : null;

  return {
    generatedAt: new Date().toISOString(),
    timezone: 'Europe/Athens',
    user: {
      displayName: profile?.name || '',
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      dateOfBirth: profile?.date_of_birth || profile?.acf?.date_of_birth || null,
    },
    fitnessStats: profile?.fitness_stats || {},
    goals: {
      activeCount: activeGoals.length,
      daily: dailyGoals,
      weekly: weeklyGoals,
    },
    calendar30Days: {
      from: daysAgoDateKey(30),
      to: daysAgoDateKey(0),
      totals: {
        workouts: totalWorkouts,
        meals: totalMeals,
        avgGrade,
      },
      days: calendarDays,
    },
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing OPENAI_API_KEY' });
  }

  const { messages } = req.body as { messages?: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages is required' });
  }

  const safeMessages = messages
    .filter(
      (msg): msg is ChatMessage =>
        !!msg &&
        (msg.role === 'system' || msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string',
    )
    .map((msg) => ({ role: msg.role, content: msg.content.trim() }))
    .filter((msg) => msg.content.length > 0);

  if (safeMessages.length === 0) {
    return res.status(400).json({ error: 'No valid messages to send' });
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const wpApiBase = process.env.WORDPRESS_API_URL;
    if (!wpApiBase) {
      return res.status(500).json({ error: 'Server is missing WORDPRESS_API_URL' });
    }

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const chatContextResponse = await fetch(`${wpApiBase}/fitnessgeek-api/v1/chat-context`, {
      method: 'GET',
      headers: authHeaders,
    });

    let profileData: ProfileApiResponse | null = null;
    let goalsData: GoalRow[] = [];
    let calendarData: CalendarApiResponse | null = null;

    if (chatContextResponse.ok) {
      const payload = (await chatContextResponse.json()) as ChatContextApiResponse;
      profileData = payload?.profile || null;
      goalsData = Array.isArray(payload?.goals) ? payload.goals : [];
      calendarData = payload?.calendar && typeof payload.calendar === 'object' ? payload.calendar : null;
    }

    const dataContext = buildDataContext(profileData, goalsData, calendarData);
    const contextGuardMessage: ChatMessage = {
      role: 'system',
      content:
        'Use only the provided DATA_CONTEXT for user-specific facts. If data is missing, say it explicitly and do not invent values.',
    };
    const contextDataMessage: ChatMessage = {
      role: 'system',
      content: `DATA_CONTEXT:\n${JSON.stringify(dataContext)}`,
    };

 

    const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [contextGuardMessage, contextDataMessage, ...safeMessages],
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      return res.status(openAIResponse.status).json({ error: errorText || 'OpenAI request failed' });
    }

    const data = await openAIResponse.json();
    const answer = extractOutputText(data);

    return res.status(200).json({
      answer: answer || 'I could not generate a response.',
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unexpected server error',
    });
  }
}
