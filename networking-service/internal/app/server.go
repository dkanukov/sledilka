package app

import (
	"context"
	"fmt"
	"github.com/irai/arp"
	"log"
	"networking-service/internal/network"
	"networking-service/internal/watcher"
	"sync"
)

type server struct {
	arpHandler     *arp.Handler
	notificationCh chan arp.MACEntry
	mx             sync.Mutex
	subscribers    map[string]chan arp.MACEntry
	ctx            context.Context
	network.UnimplementedNetworkServer
}

func NewServer(ctx context.Context) (*server, error) {
	arpHandler, err := watcher.NewHandler()
	if err != nil {
		return nil, err
	}
	s := &server{
		arpHandler:     arpHandler,
		notificationCh: make(chan arp.MACEntry),
		subscribers:    make(map[string]chan arp.MACEntry),
		ctx:            ctx,
	}
	arpHandler.AddNotificationChannel(s.notificationCh)
	go func() {
		err = s.arpHandler.ListenAndServe(ctx)
		if err != nil {
			log.Fatal(fmt.Errorf("arpHandler.ListenAndServe %w", err))
		}
	}()
	go s.watchUpdates()
	return s, nil
}

func (s *server) watchUpdates() {
	for {
		select {
		case entry := <-s.notificationCh:
			s.mx.Lock()
			for _, ch := range s.subscribers {
				ch <- entry
			}
			s.mx.Unlock()
		case <-s.ctx.Done():
			break
		}

	}
}
