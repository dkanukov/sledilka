package token

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/protobuf/types/known/timestamppb"
	"log"
	"time"
	"token-service/internal/tokener"
)

type CreateTokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func Create(userID string) (*tokener.CreateTokenResponse, error) {
	accessToken, err := create(userID, TokenLiveTimeShort)
	if err != nil {
		return nil, err
	}
	refreshToken, err := create(userID, TokenLiveTimeLong)
	if err != nil {
		return nil, err
	}
	return &tokener.CreateTokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    timestamppb.New(time.Now().Add(TokenLiveTimeShort)),
	}, nil
}

func create(userID string, duration time.Duration) (string, error) {
	isRefresh := false
	if duration == TokenLiveTimeLong {
		isRefresh = true
	}
	payload := jwt.MapClaims{
		"sub":        userID,
		"exp":        jwt.NewNumericDate(time.Now().Add(duration)),
		"is_refresh": isRefresh,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, payload)

	t, err := token.SignedString(jwtSecretKey)
	if err != nil {
		err = fmt.Errorf("token.SignedString: %v", err)
		log.Println(err)
		return "", err
	}
	return t, nil
}
