package dbmodel

type AnglesCoordinates []Coordinate

type Coordinate struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}
