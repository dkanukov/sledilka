package conv

func StringpToString(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func StringToStringp(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
