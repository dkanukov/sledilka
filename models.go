package sledilka

type Object struct {
	Id          string  `json:"id"`
	Name        string  `json:"name"`
	Address     string  `json:"address"`
	Description string  `json:"description"` // ?????
	Layers      []Layer `json:"layers"`
}

type Coordinate struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type Layer struct {
	Id                string       `json:"id"`
	FloorNumber       string       `json:"floor_number"`
	Devices           []Device     `json:"devices"` // тот же вопрос что и с floors
	Coordinates       Coordinate   `json:"coordinates"`
	ImageUrl          string       `json:"image_url"`
	AnglesCoordinates []Coordinate `json:"angles_coordinates"`
	Angle             float64      `json:"angle"`
}

type DeviceType string

const (
	Computer DeviceType = "computer"
	Camera   DeviceType = "camera"
	Printer  DeviceType = "printer"
	// etc.
)

type Device struct {
	Id         string     `json:"id"`
	Name       string     `json:"name"`
	Type       DeviceType `json:"type"`
	LayerId    string     `json:"floor_id"` // ??
	Location   Coordinate `json:"location"`
	IpAddress  string     `json:"ip"` // для подключения к камерам и мб для других нужд, хз
	MacAddress string     `json:"mac_address"`
	IsActive   bool       `json:"is_active"`
}

type CameraConnectionInfo struct {
	DeviceId     string `json:"device_id"`
	StreamingURL string `json:"streaming_url"` // example: ip:port/some/path/5
	Username     string `json:"username"`
	Password     string `json:"password"`
}
