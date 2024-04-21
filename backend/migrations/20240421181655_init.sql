-- +goose Up
-- +goose StatementBegin
CREATE TABLE objects
(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar NOT NULL,
    address varchar NOT NULL,
    description varchar NOT NULL,
    lat  float NOT NULL,
    long  float NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL,
    updated_at timestamp
);

CREATE TABLE layers
(
    id                 uuid      DEFAULT gen_random_uuid() PRIMARY KEY,
    object_id          uuid references objects (id) NOT NULL,
    floor_name         varchar NOT NULL,
    angles_coordinates pg_catalog.jsonb NOT NULL,
    image_name         varchar NOT NULL,
    angle              float DEFAULT 0 NOT NULL,
    created_at         timestamp DEFAULT now() NOT NULL,
    updated_at         timestamp
);

CREATE TYPE device_type AS ENUM (
    'computer', 'camera', 'printer'
    );

CREATE TABLE devices
(
    id          uuid      DEFAULT gen_random_uuid() PRIMARY KEY,
    name        varchar NOT NULL,
    type        device_type NOT NULL,
    layer_id    uuid references layers (id) NOT NULL,
    location_x  float NOT NULL,
    location_y  float NOT NULL,
    angle       float NOT NULL,
    ip_address  varchar,
    camera_connection_url varchar,
    mac_address varchar NOT NULL,
    created_at  timestamp DEFAULT now() NOT NULL,
    updated_at  timestamp
);

CREATE TABLE users
(
    id uuid UNIQUE references devices (id) NOT NULL,
    username varchar UNIQUE NOT NULL,
    password_hash varchar NOT NULL,
    is_admin bool default false NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE camera_connection_info;
DROP TABLE devices;
DROP TYPE device_type;
DROP TABLE layers;
DROP TABLE objects;
DROP TABLE users;
-- +goose StatementEnd
