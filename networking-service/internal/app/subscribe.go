package app

import (
	"errors"
	"github.com/irai/arp"
	"networking-service/internal/conv"

	"networking-service/internal/network"
)

func (s *server) Subscribe(req *network.SubscribeRequest, sub network.Network_SubscribeServer) error {
	s.mx.Lock()
	if _, ok := s.subscribers[req.GetRequestId()]; ok {
		return errors.New("request id is already in use")
	}
	ch := make(chan arp.MACEntry)
	s.subscribers[req.GetRequestId()] = ch
	s.mx.Unlock()
	for {
		select {
		case d := <-ch:
			dev := conv.MacEntryToProto(d)
			err := sub.Send(dev)
			if err != nil {
				return err
			}
		case <-sub.Context().Done():
			s.mx.Lock()
			delete(s.subscribers, req.GetRequestId())
			s.mx.Unlock()
			close(ch)
			return nil
		}
	}
}
