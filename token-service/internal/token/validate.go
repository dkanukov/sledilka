package token

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

func Validate(token string) (string, error) {
	return validate(token, false)
}

func validate(inputToken string, isRefresh bool) (userId string, err error) {
	token, err := jwt.Parse(inputToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("there's an error with the signing method")
		}
		return jwtSecretKey, nil

	})
	if err != nil {
		return userId, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return userId, fmt.Errorf("unable to extract claims")
	}
	var exp time.Time
	switch iat := claims["exp"].(type) {
	case float64:
		exp = time.Unix(int64(iat), 0)
	default:
		return "", fmt.Errorf("unable to extract claim expires_at")
	}
	if time.Now().After(exp) {
		return userId, fmt.Errorf("expired token")
	}
	isRefreshToken, ok := claims["is_refresh"].(bool)
	if !ok {
		return userId, fmt.Errorf("unable to extract claim is_refresh")
	}
	if isRefreshToken != isRefresh {
		return userId, fmt.Errorf("you sent incorrect token")
	}
	userID, ok := claims["sub"].(string)
	if !ok {
		return userId, fmt.Errorf("unable to extract claim userID")
	}

	return userID, nil
}
