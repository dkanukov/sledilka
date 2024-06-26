package watcher

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/irai/arp"
	"gopkg.in/yaml.v3"
)

const configPath = "config/config.yaml"

type config struct {
	NetworkInterface string `yaml:"network_interface"`
}

func NewHandler() (*arp.Handler, error) {
	cfg, err := parseConfig()
	if err != nil {
		return nil, err
	}
	HostIP, HostMAC, err := getNICInfo(cfg.NetworkInterface)
	if err != nil {
		return nil, err
	}

	HomeLAN := net.IPNet{IP: net.IPv4(HostIP[0], HostIP[1], HostIP[2], 0), Mask: net.CIDRMask(25, 32)}
	HomeRouterIP, err := getLinuxDefaultGateway()
	if err != nil {
		return nil, err
	}
	handler, err := arp.New(arp.Config{
		NIC:                     cfg.NetworkInterface,
		HostMAC:                 HostMAC,
		HostIP:                  HostIP,
		RouterIP:                HomeRouterIP,
		HomeLAN:                 HomeLAN,
		FullNetworkScanInterval: 1 * time.Minute,
		ProbeInterval:           20 * time.Second,
		OfflineDeadline:         10 * time.Second,
		PurgeDeadline:           1 * time.Hour,
	})
	if err != nil {
		return nil, err
	}
	return handler, nil
}

func getNICInfo(nic string) (ip net.IP, mac net.HardwareAddr, err error) {

	all, err := net.Interfaces()
	for _, v := range all {
		log.Printf("interface name %s %s", v.Name, v.HardwareAddr.String())
	}
	ifi, err := net.InterfaceByName(nic)
	if err != nil {
		log.Printf("NIC cannot open nic %s error %s ", nic, err)
		return ip, mac, err
	}

	mac = ifi.HardwareAddr

	addrs, err := ifi.Addrs()
	if err != nil {
		log.Printf("NIC cannot get addresses nic %s error %s ", nic, err)
		return ip, mac, err
	}

	for i := range addrs {
		tmp, _, err := net.ParseCIDR(addrs[i].String())
		if err != nil {
			log.Printf("NIC cannot parse IP %s error %s ", addrs[i].String(), err)
		}
		log.Print("IP=", tmp)
		ip = tmp.To4()
		if ip != nil && !ip.Equal(net.IPv4zero) {
			break
		}
	}

	if ip == nil || ip.Equal(net.IPv4zero) {
		err = fmt.Errorf("NIC cannot find IPv4 address list - is %s up?", nic)
		log.Print(err)
		return ip, mac, err
	}

	log.Printf("NIC successfull acquired host nic information mac=%s ip=%s", mac, ip)
	return ip, mac, err
}

const (
	file  = "/proc/net/route"
	line  = 1    // line containing the gateway addr. (first line: 0)
	sep   = "\t" // field separator
	field = 2    // field containing hex gateway address (first field: 0)
)

// NICDefaultGateway read the default gateway from linux route file
//
// file: /proc/net/route file:
//
//	Iface   Destination Gateway     Flags   RefCnt  Use Metric  Mask
//	eth0    00000000    C900A8C0    0003    0   0   100 00000000    0   00
//	eth0    0000A8C0    00000000    0001    0   0   100 00FFFFFF    0   00
func getLinuxDefaultGateway() (gw net.IP, err error) {

	file, err := os.Open(file)
	if err != nil {
		log.Print("NIC cannot open route file ", err)
		return net.IPv4zero, err
	}
	defer file.Close()

	ipd32 := net.IP{}
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {

		// jump to line containing the gateway address
		for i := 0; i < line; i++ {
			scanner.Scan()
		}

		// get field containing gateway address
		tokens := strings.Split(scanner.Text(), sep)
		gatewayHex := "0x" + tokens[field]

		// cast hex address to uint32
		d, _ := strconv.ParseInt(gatewayHex, 0, 64)
		d32 := uint32(d)

		// make net.IP address from uint32
		ipd32 = make(net.IP, 4)
		binary.LittleEndian.PutUint32(ipd32, d32)
		fmt.Printf("NIC default gateway is %T --> %[1]v\n", ipd32)

		// format net.IP to dotted ipV4 string
		//ip := net.IP(ipd32).String()
		//fmt.Printf("%T --> %[1]v\n", ip)

		// exit scanner
		break
	}
	return ipd32, nil
}

func parseConfig() (config, error) {
	var c config
	f, err := os.Open(configPath)
	if err != nil {
		return c, err
	}
	b, err := io.ReadAll(f)
	if err != nil {
		return c, err
	}
	err = yaml.Unmarshal(b, &c)
	return c, err
}
