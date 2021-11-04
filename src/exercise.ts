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
  distanceUnit: 'Kilometer';
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
