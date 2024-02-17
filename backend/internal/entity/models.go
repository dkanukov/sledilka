package entity

import (
	"github.com/google/uuid"
	"time"
)

type Object struct {
	ID          uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Name        string    `json:"name"`
	Address     string    `json:"address"`
	Description string    `json:"description"`
	Layers      []Layer   `json:"layers" gorm:"foreignKey:ObjectID"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type NewObject struct {
	Name        string `json:"name"`
	Address     string `json:"address"`
	Description string `json:"description"`
}

type Layer struct {
	ID          uuid.UUID `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	ObjectID    uuid.UUID `json:"object_id"`
	FloorName   string    `json:"floor_name"`
	Devices     []Device  `json:"devices,omitempty" gorm:"foreignKey:LayerID"`
	CoordinateX float64   `json:"coordinate_x"`
	CoordinateY float64   `json:"coordinate_y"`
	Image       string    `json:"image"`
	Angle       float64   `json:"angle"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type NewLayer struct {
	Image       string  `json:"image"`
	FloorName   string  `json:"floor_name"`
	CoordinateX float64 `json:"coordinate_x"`
	CoordinateY float64 `json:"coordinate_y"`
	Angle       float64 `json:"angle"`
}

type DeviceType string

const (
	Computer DeviceType = "computer"
	Camera   DeviceType = "camera"
	Printer  DeviceType = "printer"
	// etc.
)

var AvailableDeviceTypes = map[DeviceType]bool{
	Computer: true,
	Camera:   true,
	Printer:  true,
}

type Device struct {
	Id         uuid.UUID  `json:"id,omitempty" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Name       string     `json:"name"`
	Type       DeviceType `json:"type"`
	LayerID    uuid.UUID  `json:"layer_id,omitempty"` // ??
	LocationX  float64    `json:"location_x"`
	LocationY  float64    `json:"location_y"`
	IpAddress  string     `json:"ip"` // для подключения к камерам и мб для других нужд, хз
	MacAddress string     `json:"mac_address"`
	IsActive   bool       `json:"is_active"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}

type NewDevice struct {
	Name       string     `json:"name"`
	Type       DeviceType `json:"type"`
	LayerID    uuid.UUID  `json:"layer_id,omitempty"` // ??
	LocationX  float64    `json:"location_x"`
	LocationY  float64    `json:"location_y"`
	IpAddress  string     `json:"ip,omitempty"` // для подключения к камерам и мб для других нужд, хз
	MacAddress string     `json:"mac_address"`
}

type CameraConnectionInfo struct {
	DeviceId     uuid.UUID `json:"device_id" gorm:"type:uuid"`
	StreamingURL string    `json:"streaming_url"` // example: ip:port/some/path/5
	Username     string    `json:"username"`
	Password     string    `json:"password"`
}