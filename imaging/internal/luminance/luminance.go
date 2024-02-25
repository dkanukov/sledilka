package luminance

func IsLowLight(luminance [256]float64) bool {
	lowTones := 0.0
	for i := 0; i < 64; i++ {
		lowTones += luminance[i]
	}
	midPlusTones := 0.0
	for i := 65; i < len(luminance); i++ {
		midPlusTones += luminance[i]
	}

	return lowTones > midPlusTones
}
