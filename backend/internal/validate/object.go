package validate

import (
	"backend/internal/dbmodel"
	"backend/internal/utils"
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
)

func CreateObject(r *http.Request) (dbmodel.CreateObjectParams, error) {
	return utils.ValidateBody[dbmodel.CreateObjectParams](r.Body)
}

func UpdateObject(r *http.Request, q *dbmodel.Queries) (dbmodel.UpdateObjectParams, int, error) {
	id, err := UUID(r)
	if err != nil {
		return dbmodel.UpdateObjectParams{}, http.StatusBadRequest, err
	}
	obj, err := q.GetObjectById(r.Context(), id)
	switch {
	case errors.Is(err, sql.ErrNoRows):
		return dbmodel.UpdateObjectParams{}, http.StatusNotFound, err
	case err != nil:
		return dbmodel.UpdateObjectParams{}, http.StatusInternalServerError, err
	}
	uObj := dbmodel.UpdateObjectParams{
		ID:          obj.ID,
		Name:        obj.Name,
		Address:     obj.Address,
		Description: obj.Description,
		Lat:         obj.Lat,
		Long:        obj.Long,
	}
	if err = json.NewDecoder(r.Body).Decode(&uObj); err != nil {
		return dbmodel.UpdateObjectParams{}, http.StatusBadRequest, err
	}
	return uObj, 200, nil
}
