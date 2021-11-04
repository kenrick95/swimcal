const exerciseDataModules = import.meta.glob('../data/exercise-*.json');

/**
 * @example "09/15/21 13:32:56" means 15 Sept 2021 13:32:56 UTC+0
 */
type UtcDateTime = string;

/**
 * @example 3000000 means 50 minutes
 */
type TimeInMs = number;
export interface Exercise {
  logId: number;
  activityName: string;
  activityTypeId: number;
  activityLevel: Array<{
    minutes: 0;
    name: string;
  }>;
  calories: number;
  distance: number;
  distanceUnit: 'Kilometer' | 'Mile';
  duration: TimeInMs;
  activeDuration: TimeInMs;
  logType: 'manual' | 'mobile_run';
  manualValuesSpecified: {
    calories: boolean;
    distance: boolean;
    steps: boolean;
  };
  speed: number;
  pace: number;
  lastModified: UtcDateTime;
  startTime: UtcDateTime;
  originalStartTime: UtcDateTime;
  originalDuration: TimeInMs;
  hasGps: boolean;
  shouldFetchDetails: boolean;
  hasActiveZoneMinutes: boolean;
}

async function getExerciseData(): Promise<Array<Exercise>> {
  const exerciseData: Array<Exercise> = [];

  await Promise.all(
    Object.values(exerciseDataModules).map(async (entry) => {
      const mod = await entry();
      exerciseData.push(...mod.default);
    })
  );

  exerciseData.sort((a, b) => {
    if (a.logId < b.logId) {
      return -1;
    } else if (b.logId > b.logId) {
      return 1;
    }
    return 0;
  });
  return exerciseData;
}
export async function getSwimData() {
  return (await getExerciseData()).filter((exercise) => {
    return exercise.activityName === 'Swim';
  });
}
export function yearFilter(year: number) {
  return (exercise: Exercise) => {
    const time = new Date(exercise.startTime + ' GMT');
    return time.getFullYear() === year;
  };
}

export function yearMonthFilter(year: number, month: number) {
  return (exercise: Exercise) => {
    const time = new Date(exercise.startTime + ' GMT');
    return time.getFullYear() === year && time.getMonth() + 1 === month;
  };
}
export function yearMonthDateFilter(year: number, month: number, date: number) {
  return (exercise: Exercise) => {
    const time = new Date(exercise.startTime + ' GMT');
    return (
      time.getFullYear() === year &&
      time.getMonth() + 1 === month &&
      time.getDate() === date
    );
  };
}

export function totalDistanceInKm(exercises: Exercise[]): number {
  let result = 0;
  for (const exercise of exercises) {
    result +=
      exercise.distanceUnit === 'Kilometer'
        ? exercise.distance
        : exercise.distance * 1.609344;
  }
  return result;
}

export function totalDurationInMs(exercises: Exercise[]): number {
  let result = 0;
  for (const exercise of exercises) {
    result += exercise.duration;
  }
  return result;
}

export function formatDistance(km: number): string {
  return `${Math.round(100 * km) / 100} km`;
}
export function formatDuration(ms: number): string {
  const seconds = ms / 1000;
  if (seconds < 3600) {
    return `${Math.round((ms / 1000 / 60) * 100) / 100} mins`;
  }
  return `${Math.round((ms / 1000 / 3600) * 100) / 100} hrs`;
}
export function formatCount(count: number, unit: [string, string]): string {
  return count > 1 ? `${count} ${unit[1]}` : `${count} ${unit[0]}`
}