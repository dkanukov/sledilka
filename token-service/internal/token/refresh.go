package token

import (
	"google.golang.org/protobuf/types/known/timestamppb"
	"time"
	"token-service/internal/tokener"
)

func Refresh(refreshToken string) (*tokener.RefreshTokenResponse, error) {
	userID, err := validate(refreshToken, true)
	if err != nil {
		return nil, err
	}
	accessToken, err := create(userID, TokenLiveTimeShort)
	if err != nil {
		return nil, err
	}
	return &tokener.RefreshTokenResponse{
		RefreshToken: refreshToken,
		AccessToken:  accessToken,
		ExpiresAt:    timestamppb.New(time.Now().Add(TokenLiveTimeShort)),
	}, nil
}
