export enum RedisKey {
  RANKING = 'ranking',
}

export const RankingScoreWeight = Object.freeze({
  ATTENDANCE_GOAL: 1000000,
  ATTENDANCE: 10000,
  EXPERIENCE_POINT: 1,
});

export const ExperiencePointValue = Object.freeze({
  ATTENDANCE: 10,
  ATTENDANCE_GOAL: 10,
});
