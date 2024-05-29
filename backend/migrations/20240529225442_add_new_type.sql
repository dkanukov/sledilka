-- +goose Up
-- +goose StatementBegin
ALTER TYPE device_type
ADD VALUE 'scanner';
ALTER TYPE device_type
ADD VALUE 'phone';
ALTER TYPE device_type
ADD VALUE 'smart_bulb';
ALTER TYPE device_type
ADD VALUE 'smart_fridge';
ALTER TYPE device_type
ADD VALUE 'custom';
ALTER TYPE device_type
ADD VALUE 'raspberry_pi';
ALTER TYPE device_type
ADD VALUE 'machine_tool';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE device_type;
CREATE TYPE device_type AS ENUM (
    'computer', 'camera', 'printer'
    );
-- +goose StatementEnd
