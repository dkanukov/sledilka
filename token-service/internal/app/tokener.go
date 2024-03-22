package app

import "token-service/internal/tokener"

type implementation struct {
	tokener.UnimplementedTokenerServer
}

func New() *implementation {
	return &implementation{}
}
