package app

import (
	"context"
	"log"
	"token-service/internal/token"
	"token-service/internal/tokener"
)

func (i *implementation) CreateToken(ctx context.Context, request *tokener.CreateTokenRequest) (*tokener.CreateTokenResponse, error) {
	resp, err := token.Create(request.GetUserId())
	if err != nil {
		log.Println(err)
		return nil, err
	}
	return resp, err
}
