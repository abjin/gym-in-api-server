export type SnsUser = {
  type: $Enums.AccountType;
  id: string;
  nickname?: string;
};

export type KakaoGetUserProfileApiResponse = {
  id: number;
  kakao_account: { profile: { nickname: string } };
};

export type JwtPayload = { id: string };

export type IncreaseAttendanceRankingScoreParams = {
  owner: string;
  isGoalAchieved: boolean;
  successCount: number;
};

};
