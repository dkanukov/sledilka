package sledilka

import (
	"backend/internal/dbmodel"
	"backend/internal/handlers/luminance"
	"backend/internal/handlers/streaming"
	"backend/internal/network"
	"backend/internal/tokener"
	"backend/internal/utils"
	gmux "github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/rs/cors"
	httpSwagger "github.com/swaggo/http-swagger"
	"log"
	"net/http"
)

type Sledilka struct {
	q            *dbmodel.Queries
	server       *http.Server
	tokener      tokener.TokenerClient
	networker    network.NetworkClient
	StreamingURL string
}

func (s *Sledilka) Run() error {
	log.Println("Sledilka-backend starting")
	return s.server.ListenAndServe()
}

func New(db *pgx.Conn, client tokener.TokenerClient, networkClient network.NetworkClient, streamingUrl, sledilkaURL string) *Sledilka {
	sledilka := &Sledilka{
		q:            dbmodel.New(db),
		tokener:      client,
		networker:    networkClient,
		StreamingURL: streamingUrl,
	}
	sledilka.createServer(sledilkaURL)
	return sledilka
}

func (s *Sledilka) createServer(url string) {
	router := gmux.NewRouter()

	s.addUserHandlers(router)
	s.addTokenHandler(router)
	s.addDeviceHandlers(router)
	s.addLayerHandlers(router)
	s.addObjectHandler(router)
	s.addNetworkingHandlers(router)
	s.addImageHandler(router)

	router.HandleFunc("/new", func(w http.ResponseWriter, r *http.Request) {
		utils.NewEntities()
	}).Methods(http.MethodPost)

	router.HandleFunc("/stream/{id}", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			streaming.Get(w, r, s.q, s.StreamingURL)
		}
	}).Methods(http.MethodGet)

	router.HandleFunc("/isLowLight/{id}", func(w http.ResponseWriter, r *http.Request) {
		luminance.IsLowLighted(w, r, s.q)
	}).Methods(http.MethodGet)

	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)
	router.HandleFunc("/swagger", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger/", http.StatusSeeOther)
	})
	corsOpt := cors.AllowAll()
	s.server = &http.Server{
		Addr:    url,
		Handler: corsOpt.Handler(router),
	}
}
