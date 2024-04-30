package validate

import (
	"backend/internal/dbmodel"
	"backend/internal/entity"
	"backend/internal/utils"
	"database/sql"
	"encoding/json"
	"errors"
	"github.com/google/uuid"
	gmux "github.com/gorilla/mux"
	"net/http"
)

func CreateLayer(r *http.Request) (entity.NewLayer, error) {
	l, err := utils.ValidateBody[entity.NewLayer](r.Body)
	if err != nil {
		return entity.NewLayer{}, err
	}

	return l, nil
}

func UpdateLayer(r *http.Request, q *dbmodel.Queries) (dbmodel.UpdateLayerParams, int, error) {
	idParam := gmux.Vars(r)["id"]
	id, err := uuid.Parse(idParam)
	if err != nil {
		return dbmodel.UpdateLayerParams{}, http.StatusBadRequest, err
	}
	oldLayer, err := q.GetLayerById(r.Context(), id)
	switch {
	case errors.Is(err, sql.ErrNoRows):
		return dbmodel.UpdateLayerParams{}, http.StatusBadRequest, DeviceNotFound
	case err != nil:
		return dbmodel.UpdateLayerParams{}, http.StatusInternalServerError, err
	}

	lay := entity.NewLayer{
		Image:             oldLayer.ImageName,
		FloorName:         oldLayer.FloorName,
		Angle:             oldLayer.Angle,
		AnglesCoordinates: oldLayer.AnglesCoordinates,
	}
	if err = json.NewDecoder(r.Body).Decode(&lay); err != nil {
		return dbmodel.UpdateLayerParams{}, http.StatusBadRequest, err
	}
	return dbmodel.UpdateLayerParams{
		ID:                id,
		FloorName:         lay.FloorName,
		AnglesCoordinates: lay.AnglesCoordinates,
		ImageName:         lay.Image,
		Angle:             lay.Angle,
	}, 200, nil
}
