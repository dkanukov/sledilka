package token

import (
	"time"
)

var (
	TokenLiveTimeShort = time.Now().Add(10 * time.Minute).Unix()
	TokenLiveTimeLong  = time.Now().Add(12 * time.Hour).Unix()
)
