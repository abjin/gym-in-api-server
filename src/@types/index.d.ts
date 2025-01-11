export type SnsUser = {
  type: $Enums.AccountType;
  id: string;
  nickname?: string;
};

export type KakaoGetUserProfileApiResponse = {
  id: number;
  kakao_account: { profile: { nickname: string } };
};
