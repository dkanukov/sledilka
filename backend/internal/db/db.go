package db

import (
	"context"
	"fmt"
	"github.com/compose-spec/compose-go/v2/types"
	"github.com/jackc/pgx/v5"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

const (
	user     = "postgres"
	password = "postgres"
	dbname   = "postgres"
)

func StartupDB(ctx context.Context, info types.ServiceConfig) (*pgx.Conn, error) {
	dsn := fmt.Sprintf("host=%v user=%v password=%v dbname=%v port=%v sslmode=disable",
		"0.0.0.0",
		//info.Name,
		user, password, dbname,
		info.Ports[0].Published)
	db, err := goose.OpenDBWithDriver("pgx", dsn)
	if err != nil {
		return nil, err
	}

	if err = goose.Up(db, "migrations"); err != nil {
		return nil, err
	}
	if err = db.Close(); err != nil {
		return nil, err
	}
	return pgx.Connect(ctx, dsn)
}
