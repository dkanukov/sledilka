package db

import (
	"backend/internal/entity"
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	host     = "db"
	port     = 5432
	user     = "postgres"
	password = "postgres"
	dbname   = "postgres"
)

func StartupDB() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%v user=%v password=%v dbname=%v port=%v sslmode=disable",
		host, user, password, dbname, port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
	// TODO migrate other entities
	if err := db.AutoMigrate(&entity.User{}, &entity.Review{}, &entity.Announcement{}); err != nil {
		return nil, err
	}
	fmt.Println("Successfully connected!")
	return db, nil
}
