package sledilka

import (
	"backend/internal/authorization"
	"backend/internal/conv"
	"backend/internal/entity"
	"backend/internal/handlers/devices"
	"backend/internal/network"
	"backend/internal/utils"
	"database/sql"
	"errors"
	"fmt"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"io"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (s *Sledilka) addNetworkingHandlers(router *mux.Router) {
	router.HandleFunc("/network", authorization.JwtAuthMiddleware(s.handleNetworkFunc, s.tokener)).Methods(http.MethodGet)
	router.HandleFunc("/subscribe-network", authorization.JwtAuthMiddleware(s.handleSubscribeFunc, s.tokener)).Methods(http.MethodGet)
}

// @Summary	Получить список адресов в сети
// @Tags		networking
// @Produce	json
// @Success	200		{object}	[]entity.DeviceStatus
// @Failure	500
// @Security ApiKeyAuth
// @Router		/network [get]
func (s *Sledilka) handleNetworkFunc(w http.ResponseWriter, r *http.Request) {
	m, err := s.networker.GetAllMacAddresses(r.Context(), &network.Empty{})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}
	res := make([]entity.DeviceStatus, 0, len(m.GetDevices()))
	for _, dev := range m.GetDevices() {
		isBusy, err := s.q.IsMacAddressBusy(r.Context(), dev.GetMacAddress())
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprint(w, err)
			return
		}
		res = append(res, entity.DeviceStatus{
			MacAddress: dev.GetMacAddress(),
			IsActive:   dev.GetIsActive(),
			IsBusy:     isBusy,
			IpAddress:  conv.StringToStringp(dev.GetIpAddress()),
		})
	}
	fmt.Fprint(w, utils.MustJSON(res))

}

// @Summary	Подписаться на обновления из сети. WebSocket
// @Tags		networking
// @Produce	json
// @Success	200		{object}	entity.Device
// @Failure	500
// @Security ApiKeyAuth
// @Router		/subscribe-network [get]
func (s *Sledilka) handleSubscribeFunc(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	stream, err := s.networker.Subscribe(
		r.Context(),
		&network.SubscribeRequest{RequestId: uuid.NewString()},
	)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprint(w, err)
		return
	}
	for {
		resp, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprint(w, err)
			return
		}
		dev, err := s.q.GetDeviceByMacAddress(r.Context(), resp.GetMacAddress())
		switch {
		case errors.Is(err, sql.ErrNoRows):
			continue
		case err != nil:
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprint(w, err)
			return
		}
		toSend := devices.ToApi(dev)
		toSend.IsActive = resp.GetIsActive()
		toSend.IpAddress = resp.GetIpAddress()
		if resp != nil {
			ws.WriteJSON(toSend)
		}
	}

}

func macSliceToMap(devs []*network.DeviceStatus) map[string]*network.DeviceStatus {
	res := make(map[string]*network.DeviceStatus)
	for _, dev := range devs {
		res[dev.MacAddress] = dev
	}
	return res
}

func macMapToSlice(devs map[string]*network.DeviceStatus) []*network.DeviceStatus {
	res := make([]*network.DeviceStatus, 0, len(devs))
	for _, dev := range devs {
		res = append(res, dev)
	}
	return res
}
