// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package dbmodel

import (
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type DeviceType string

const (
	DeviceTypeComputer DeviceType = "computer"
	DeviceTypeCamera   DeviceType = "camera"
	DeviceTypePrinter  DeviceType = "printer"
)

func (e *DeviceType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = DeviceType(s)
	case string:
		*e = DeviceType(s)
	default:
		return fmt.Errorf("unsupported scan type for DeviceType: %T", src)
	}
	return nil
}

type NullDeviceType struct {
	DeviceType DeviceType `json:"device_type"`
	Valid      bool       `json:"valid"` // Valid is true if DeviceType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullDeviceType) Scan(value interface{}) error {
	if value == nil {
		ns.DeviceType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.DeviceType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullDeviceType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.DeviceType), nil
}

func (e DeviceType) Valid() bool {
	switch e {
	case DeviceTypeComputer,
		DeviceTypeCamera,
		DeviceTypePrinter:
		return true
	}
	return false
}

type Device struct {
	ID                  uuid.UUID  `json:"id"`
	Name                string     `json:"name"`
	Type                DeviceType `json:"type"`
	LayerID             uuid.UUID  `json:"layer_id"`
	LocationX           float64    `json:"location_x"`
	LocationY           float64    `json:"location_y"`
	Angle               float64    `json:"angle"`
	IpAddress           *string    `json:"ip_address"`
	CameraConnectionUrl *string    `json:"camera_connection_url"`
	MacAddress          string     `json:"mac_address"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           *time.Time `json:"updated_at"`
}

type Layer struct {
	ID                uuid.UUID         `json:"id"`
	ObjectID          uuid.UUID         `json:"object_id"`
	FloorName         string            `json:"floor_name"`
	AnglesCoordinates AnglesCoordinates `json:"angles_coordinates"`
	ImageName         string            `json:"image_name"`
	Angle             float64           `json:"angle"`
	CreatedAt         time.Time         `json:"created_at"`
	UpdatedAt         *time.Time        `json:"updated_at"`
}

type Object struct {
	ID          uuid.UUID  `json:"id"`
	Name        string     `json:"name"`
	Address     string     `json:"address"`
	Description string     `json:"description"`
	Lat         float64    `json:"lat"`
	Long        float64    `json:"long"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
}

type User struct {
	ID           uuid.UUID `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"password_hash"`
	IsAdmin      bool      `json:"is_admin"`
}
