package sledilka

import (
	"backend/internal/authorization"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"backend/internal/dbmodel"
	"backend/internal/entity"
	"backend/internal/handlers/devices"
	"backend/internal/network"
	"backend/internal/utils"
	"backend/internal/validate"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type (
	Layer    entity.Layer
	NewLayer entity.NewLayer
)

func (s *Sledilka) addLayerHandlers(router *mux.Router) {
	router.HandleFunc("/objects/{id}/layers", authorization.JwtAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			id, err := validate.UUID(r)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				fmt.Fprint(w, err)
				return
			}
			l, err := validate.CreateLayer(r)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				fmt.Fprint(w, err)
				return
			}
			layer, code, err := s.createLayers(r.Context(), dbmodel.CreateLayerParams{
				ObjectID:          id,
				FloorName:         l.FloorName,
				AnglesCoordinates: l.AnglesCoordinates,
				ImageName:         l.Image,
				Angle:             l.Angle,
			})
			if err != nil {
				w.WriteHeader(code)
				fmt.Fprint(w, err)
				return
			}
			fmt.Fprint(w, utils.MustJSON(layer))
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}, s.tokener)).Methods(http.MethodPost)

	router.HandleFunc("/objects/{object_id}/layers/{id}", authorization.JwtAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			id, err := validate.UUID(r)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				fmt.Fprint(w, err)
				return
			}
			l, code, err := s.getLayer(r.Context(), id)
			if err != nil {
				w.WriteHeader(code)
				fmt.Fprint(w, err)
				return
			}
			fmt.Fprint(w, utils.MustJSON(l))
		}
	}, s.tokener)).Methods(http.MethodGet)

	router.HandleFunc("/objects/{object_id}/layers/{id}", authorization.JwtAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPatch:
			updLayer, code, err := validate.UpdateLayer(r, s.q)
			if err != nil {
				w.WriteHeader(code)
				fmt.Fprint(w, err)
				return
			}
			l, err := s.q.UpdateLayer(r.Context(), updLayer)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprint(w, err)
				return
			}
			devs, err := s.collectDevice(r.Context(), l.ID)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprint(w, err)
				return
			}
			layer := entity.Layer{
				ID:                l.ID,
				ObjectID:          l.ObjectID,
				FloorName:         l.FloorName,
				Devices:           devs,
				AnglesCoordinates: l.AnglesCoordinates,
				Image:             l.ImageName,
				Angle:             l.Angle,
				CreatedAt:         l.CreatedAt,
				UpdatedAt:         l.UpdatedAt,
			}
			fmt.Fprint(w, utils.MustJSON(layer))
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}, s.tokener)).Methods(http.MethodPatch)
}

// @Summary	Получить слой
// @Tags		layers
// @Produce	json
// @Param		id path string true "Layer ID"
// @Param		object_id path string true "Object ID"
// @Success	200		{object}	Layer
// @Security ApiKeyAuth
// @Failure	500
// @Router		/objects/{object_id}/layers/{id} [get]
func (s *Sledilka) getLayer(ctx context.Context, id uuid.UUID) (entity.Layer, int, error) {
	layer, err := s.q.GetLayerById(ctx, id)
	switch {
	case errors.Is(err, sql.ErrNoRows):
		return entity.Layer{}, http.StatusNotFound, err
	case err != nil:
		return entity.Layer{}, http.StatusInternalServerError, err
	}
	devs, err := s.collectDevice(ctx, layer.ID)
	if err != nil {
		return entity.Layer{}, http.StatusInternalServerError, err
	}
	return entity.Layer{
		ID:                layer.ID,
		ObjectID:          layer.ObjectID,
		FloorName:         layer.FloorName,
		Devices:           devs,
		AnglesCoordinates: layer.AnglesCoordinates,
		Image:             layer.ImageName,
		Angle:             layer.Angle,
		CreatedAt:         layer.CreatedAt,
		UpdatedAt:         layer.UpdatedAt,
	}, 200, nil
}

func (s *Sledilka) collectDevice(ctx context.Context, id uuid.UUID) ([]entity.Device, error) {
	dbDevs, err := s.q.GetAllLayerDevices(ctx, id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}
	devs := devices.ListToApi(dbDevs)
	if len(devs) == 0 {
		return devs, nil
	}
	resp, err := s.networker.IsActiveListDevice(ctx, &network.IsActiveListDeviceRequest{Devices: devices.GetMacAddresses(devs)})
	if err != nil {
		return devs, err
	}
	for i := range devs {
		devs[i].IsActive = resp.GetDevices()[i].GetIsActive()
	}
	return devs, err
}

// @Summary	Создать слой
// @Tags		layers
// @Accept		json
// @Produce	json
// @Param		request	body		NewLayer true "Новый слой"
// @Param		id path string true "Object ID"
// @Success	200		{object}	Layer
// @Security ApiKeyAuth
// @Failure	500
// @Router		/objects/{id}/layers [post]
func (s *Sledilka) createLayers(ctx context.Context, params dbmodel.CreateLayerParams) (entity.Layer, int, error) {
	layer, err := s.q.CreateLayer(ctx, params)
	if err != nil {
		return entity.Layer{}, http.StatusInternalServerError, err
	}
	devs, err := s.collectDevice(ctx, layer.ID)
	if err != nil {
		return entity.Layer{}, http.StatusInternalServerError, err
	}
	return entity.Layer{
		ID:                layer.ID,
		ObjectID:          layer.ObjectID,
		FloorName:         layer.FloorName,
		Devices:           devs,
		AnglesCoordinates: layer.AnglesCoordinates,
		Image:             layer.ImageName,
		Angle:             layer.Angle,
		CreatedAt:         layer.CreatedAt,
		UpdatedAt:         layer.UpdatedAt,
	}, 200, nil
}

// @Summary	Изменить слой
// @Tags		layers
// @Accept		json
// @Produce	json
// @Param		request	body	NewLayer	true	"Измененный слой"
// @Param		object_id path string true "Object ID"
// @Param		id path string true "Layer ID"
// @Success	200	{object}	Layer
// @Security ApiKeyAuth
// @Failure	500
// @Router		/objects/{object_id}/layers/{id} [patch]
func updLay() {
	//заглушка для сваггера
}
