package token

import (
	"time"
)

const (
	TokenLiveTimeShort = 1 * time.Hour
	TokenLiveTimeLong  = 24 * time.Hour
)

var jwtSecretKey = []byte("c5d60d79-09cb-44a1-a934-e05fb12c2953")
