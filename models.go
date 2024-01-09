package sledilka

type Building struct {
	Id          string  `json:"id"`
	Name        string  `json:"name"`
	Address     string  `json:"address"`
	Description string  `json:"description"` // ?????
	Floors      []Floor `json:"floors"`      // или это отдельно возращать при дергании специальной ручки
	// Coordinates?????????
}

type Coordinate struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type Floor struct {
	Id         string       `json:"id"`
	BuildingId string       `json:"building_id"` // ????
	Number     int          `json:"number"`      //тут мб можно стринг так как этажи могут быть с буквами
	ImagePath  string       `json:"-"`           // ?? типа для нужд бэка а не для фронта
	Angles     []Coordinate `json:"angles"`      // ?? типа координаты углов этажа чтоб по ним как многоугольник построить
	Devices    []Device     `json:"devices"`     // тот же вопрос что и с floors
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
	FloorId    string     `json:"floor_id"` // ??
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
