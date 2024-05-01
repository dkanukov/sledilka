-- name: CreateObject :one
INSERT INTO objects(name, address, description, lat, long)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: CreateLayer :one
INSERT INTO layers(object_id, floor_name, angles_coordinates, image_name, angle)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: CreateDevice :one
INSERT INTO devices(name, type, layer_id, location_x, location_y, angle, ip_address, mac_address, camera_connection_url)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: UpdateObject :one
UPDATE objects
SET name=$2, address = $3, description = $4, lat=$5, long=$6, updated_at=now()
WHERE id=$1
RETURNING *;

-- name: UpdateLayer :one
UPDATE layers
SET floor_name = $2, angles_coordinates = $3, image_name = $4, angle = $5, updated_at=now()
WHERE id=$1
RETURNING *;

-- name: UpdateDevice :one
UPDATE devices
SET name=$2, type=$3, layer_id=$4, location_x=$5, location_y=$6, angle=$7, ip_address=$8, mac_address=$9, camera_connection_url=$10, updated_at=now()
WHERE id=$1
RETURNING *;

-- name: GetAllObjects :many
SELECT *
FROM objects;

-- name: GetAllObjectLayers :many
SELECT *
FROM layers
WHERE object_id=$1;

-- name: GetAllLayerDevices :many
SELECT *
from devices
WHERE layer_id = $1;

-- name: GetObjectById :one
SELECT *
FROM objects
WHERE id = $1;

-- name: GetLayerById :one
SELECT *
FROM layers
WHERE id = $1;

-- name: GetDeviceById :one
SELECT *
FROM devices
WHERE id = $1;

-- name: GetDeviceByMacAddress :one
SELECT *
FROM devices
where mac_address=$1;

-- name: DeleteDeviceById :exec
DELETE FROM devices
WHERE id = $1;

-- name: DeleteLayerDevices :exec
DELETE FROM devices
WHERE layer_id = $1;

-- name: DeleteLayerById :exec
DELETE FROM layers
WHERE id = $1;

-- name: DeleteObjectLayers :exec
DELETE FROM layers
WHERE object_id = $1;

-- name: CreateUser :one
INSERT INTO users(username, password_hash, is_admin)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetUserByUsername :one
SELECT *
FROM users
WHERE username = $1;

-- name: GetAllUsers :many
SELECT *
FROM users;

-- name: GetUserById :one
SELECT *
FROM users
WHERE id = $1;

-- name: GetCameraInfoByDeviceId :one
SELECT camera_connection_url
FROM devices
WHERE id = $1;

-- name: GetAllDevicesMacs :many
SELECT mac_address
FROM devices;

-- name: IsMacAddressBusy :one
SELECT EXISTS(
    SELECT *
    from devices
    WHERE mac_address = $1
) as is_busy;

-- name: GetRandomDevice :one
SELECT * FROM devices
ORDER BY RANDOM()
LIMIT 1;