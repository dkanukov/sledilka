package app

import (
	"context"
	"log"
	"token-service/internal/token"
	"token-service/internal/tokener"
)

func (i *implementation) RefreshToken(ctx context.Context, request *tokener.RefreshTokenRequest) (*tokener.RefreshTokenResponse, error) {
	resp, err := token.Refresh(request.GetRefreshToken())
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return resp, nil
}
