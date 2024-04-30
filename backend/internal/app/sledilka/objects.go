package sledilka

import (
	"backend/internal/authorization"
	"backend/internal/dbmodel"
	"backend/internal/entity"
	"backend/internal/utils"
	"backend/internal/validate"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"net/http"
)

type (
	Object    entity.Object
	NewObject entity.NewObject
)

func (s *Sledilka) addObjectHandler(router *mux.Router) {
	router.HandleFunc("/objects", authorization.JwtAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			objs, code, err := s.getAllObjects(r.Context())
			if err != nil {
				w.WriteHeader(code)
				fmt.Fprint(w, err)
				return
			}
			fmt.Fprint(w, utils.MustJSON(objs))
		case http.MethodPost:
			obj, err := validate.CreateObject(r)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				fmt.Fprint(w, err)
				return
			}
			newObj, err := s.q.CreateObject(r.Context(), obj)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprint(w, err)
				return
			}
			fmt.Fprint(w, utils.MustJSON(entity.Object{
				ID:          newObj.ID,
				Name:        newObj.Name,
				Address:     newObj.Address,
				Description: newObj.Description,
				Layers:      []entity.Layer{},
				Lat:         newObj.Lat,
				Long:        newObj.Long,
				CreatedAt:   newObj.CreatedAt,
				UpdatedAt:   newObj.UpdatedAt,
			}))
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}, s.tokener)).Methods(http.MethodGet, http.MethodPost)

	router.HandleFunc("/objects/{id}", authorization.JwtAuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			id, err := validate.UUID(r)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				fmt.Fprint(w, err)
				return
			}
			obj, code, err := s.getObjectById(r.Context(), id)
			if err != nil {
				w.WriteHeader(code)
				fmt.Fprint(w, err)
				return
			}
			fmt.Fprint(w, utils.MustJSON(obj))
		case http.MethodPatch:
			uObj, code, err := validate.UpdateObject(r, s.q)
			if err != nil {
				w.WriteHeader(code)
				fmt.Fprint(w, err)
				return
			}
			obj, code, err := s.updateObject(r.Context(), uObj)
			if err != nil {
				w.WriteHeader(code)
				fmt.Fprint(w, err)
				return
			}
			fmt.Fprint(w, utils.MustJSON(obj))
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}, s.tokener)).Methods(http.MethodGet, http.MethodPatch)

}

// @Summary	Возвращает все объекты
// @Tags		objects
// @Accept		json
// @Produce	json
// @Success	200	{object}	[]Object
// @Failure	500
// @Security ApiKeyAuth
// @Router		/objects [get]
func (s *Sledilka) getAllObjects(ctx context.Context) ([]entity.Object, int, error) {
	objs, err := s.q.GetAllObjects(ctx)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, http.StatusInternalServerError, err
	}
	if len(objs) == 0 {
		return []entity.Object{}, 200, nil
	}
	res := make([]entity.Object, 0, len(objs))
	for _, obj := range objs {
		collectedObj, err := s.collectObj(ctx, obj)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		res = append(res, collectedObj)
	}
	return res, 200, nil
}

// @Summary	Объект по id
// @Tags		objects
// @Accept		json
// @Produce	json
// @Success	200	{object}	Object
// @Failure	500
// @Security ApiKeyAuth
// @Router		/objects/{id} [get]
// @Param		id	path  string	true	"uuid"
func (s *Sledilka) getObjectById(ctx context.Context, id uuid.UUID) (entity.Object, int, error) {
	obj, err := s.q.GetObjectById(ctx, id)
	switch {
	case errors.Is(err, sql.ErrNoRows):
		return entity.Object{}, http.StatusNotFound, err
	case err != nil:
		return entity.Object{}, http.StatusInternalServerError, err
	}
	object, err := s.collectObj(ctx, obj)
	if err != nil {
		return entity.Object{}, http.StatusInternalServerError, err
	}
	return object, 200, nil
}

func (s *Sledilka) collectObj(ctx context.Context, obj dbmodel.Object) (entity.Object, error) {
	ls, err := s.q.GetAllObjectLayers(ctx, obj.ID)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return entity.Object{}, err
	}
	layers := make([]entity.Layer, 0, len(ls))
	if len(ls) == 0 {
		layers = []entity.Layer{}
	}
	for _, l := range ls {
		devs, err := s.collectDevice(ctx, l.ID)
		if err != nil {
			return entity.Object{}, err
		}
		layers = append(layers, entity.Layer{
			ID:                l.ID,
			ObjectID:          l.ObjectID,
			FloorName:         l.FloorName,
			Devices:           devs,
			AnglesCoordinates: l.AnglesCoordinates,
			Image:             l.ImageName,
			Angle:             l.Angle,
			CreatedAt:         l.CreatedAt,
			UpdatedAt:         l.UpdatedAt,
		})
	}
	return entity.Object{
		ID:          obj.ID,
		Name:        obj.Name,
		Address:     obj.Address,
		Description: obj.Description,
		Layers:      layers,
		Lat:         obj.Lat,
		Long:        obj.Long,
		CreatedAt:   obj.CreatedAt,
		UpdatedAt:   obj.UpdatedAt,
	}, nil
}

// @Summary	Изменить объект
// @Tags		objects
// @Accept		json
// @Produce	json
// @Param		request	body	NewObject	true	"Измененный Объект"
// @Param		id path string true "Object ID"
// @Success	200	{object}	Object
// @Security ApiKeyAuth
// @Failure	500
// @Router		/objects/{id} [patch]
func (s *Sledilka) updateObject(ctx context.Context, uObj dbmodel.UpdateObjectParams) (entity.Object, int, error) {
	obj, err := s.q.UpdateObject(ctx, uObj)
	if err != nil {
		return entity.Object{}, http.StatusInternalServerError, err
	}
	newObj, err := s.collectObj(ctx, obj)
	if err != nil {
		return entity.Object{}, http.StatusInternalServerError, err
	}
	return newObj, 200, nil
}

// @Summary	Создать объект
// @Tags		objects
// @Accept		json
// @Produce	json
// @Param		request	body		NewObject true "Новый объект"
// @Success	200		{object}	Object
// @Security ApiKeyAuth
// @Failure	500
// @Router		/objects [post]
func createObj() {
	// заглушка
}
