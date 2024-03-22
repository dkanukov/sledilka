package app

import (
	"context"
	"log"
	"token-service/internal/token"
	"token-service/internal/tokener"
)

func (i *implementation) ValidateToken(ctx context.Context, request *tokener.ValidateTokenRequest) (*tokener.ValidateTokenResponse, error) {
	userID, err := token.Validate(request.AccessToken)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return &tokener.ValidateTokenResponse{
		UserId: userID,
	}, nil
}
