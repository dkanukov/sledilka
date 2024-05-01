package entity

import (
	"backend/internal/dbmodel"
	"time"

	"github.com/google/uuid"
)

type Object struct {
	ID          uuid.UUID  `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Name        string     `json:"name"`
	Address     string     `json:"address"`
	Description string     `json:"description"`
	Layers      []Layer    `json:"layers"`
	Lat         float64    `json:"lat"`
	Long        float64    `json:"long"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
}

type NewObject struct {
	Name        string  `json:"name"`
	Address     string  `json:"address"`
	Description string  `json:"description"`
	Lat         float64 `json:"lat"`
	Long        float64 `json:"long"`
}

type (
	CreateDevice dbmodel.CreateDeviceParams
)

type DeviceStatus struct {
	MacAddress string  `json:"macAddress,omitempty"`
	IsActive   bool    `json:"isActive,omitempty"`
	IsBusy     bool    `json:"is_busy"`
	IpAddress  *string `json:"ipAddress,omitempty"`
}

type Layer struct {
	ID                uuid.UUID                 `json:"id"`
	ObjectID          uuid.UUID                 `json:"object_id"`
	FloorName         string                    `json:"floor_name"`
	Devices           []Device                  `json:"devices,omitempty"`
	AnglesCoordinates dbmodel.AnglesCoordinates `json:"angles_coordinates"`
	Image             string                    `json:"image"`
	Angle             float64                   `json:"angle"`
	CreatedAt         time.Time                 `json:"created_at"`
	UpdatedAt         *time.Time                `json:"updated_at,omitempty"`
}

type Coordinate struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}

type LayerForDB struct {
	ID                uuid.UUID  `json:"id" gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	ObjectID          uuid.UUID  `json:"object_id"`
	FloorName         string     `json:"floor_name"`
	Devices           []Device   `json:"devices,omitempty" gorm:"foreignKey:LayerID"`
	AnglesCoordinates string     `json:"angles_coordinates"`
	Image             string     `json:"image"`
	Angle             float64    `json:"angle"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         *time.Time `json:"updated_at,omitempty"`
}

type NewLayer struct {
	Image             string                    `json:"image"`
	FloorName         string                    `json:"floor_name"`
	Angle             float64                   `json:"angle"`
	AnglesCoordinates dbmodel.AnglesCoordinates `json:"angles_coordinates"`
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
	Id                  uuid.UUID  `json:"id,omitempty"`
	Name                string     `json:"name"`
	Type                DeviceType `json:"type"`
	LayerID             uuid.UUID  `json:"layer_id,omitempty"` // ??
	LocationX           float64    `json:"location_x"`
	LocationY           float64    `json:"location_y"`
	Angle               float64    `json:"angle"`
	IpAddress           string     `json:"ip,omitempty"`
	CameraConnectionURL string     `json:"camera_connection_url"`
	MacAddress          string     `json:"mac_address"`
	IsActive            bool       `json:"is_active"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           *time.Time `json:"updated_at,omitempty"`
}

type NewDevice struct {
	Name                string     `json:"name"`
	Type                DeviceType `json:"type"`
	LayerID             uuid.UUID  `json:"layer_id,omitempty"` // ??
	LocationX           float64    `json:"location_x"`
	LocationY           float64    `json:"location_y"`
	Angle               float64    `json:"angle"`
	IpAddress           string     `json:"ip,omitempty"`
	CameraConnectionURL string     `json:"camera_connection_url"`
	MacAddress          string     `json:"mac_address"`
}

type CameraConnectionInfo struct {
	DeviceId     uuid.UUID `json:"device_id" gorm:"type:uuid"`
	StreamingURL string    `json:"streaming_url"` // example: ip:port/some/path/5
	Username     string    `json:"username"`
	Password     string    `json:"password"`
}
