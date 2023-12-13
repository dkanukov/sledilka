package utils

import (
	"time"
)

func TokenExpire(liveTime time.Duration) int64 {
	return time.Now().Add(10 * time.Minute).Unix()
}
