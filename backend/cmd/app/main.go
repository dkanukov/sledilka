package main

import (
	"backend/internal/conv"
	"backend/internal/dbmodel"
	mock_network "backend/internal/mocks/mock_networking"
	"backend/internal/network"
	"backend/internal/utils"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/golang/mock/gomock"
	"log"
	"math/rand"
	"net"
	"time"

	_ "backend/docs"
	"backend/internal/app/sledilka"
	"backend/internal/db"
	"backend/internal/tokener"
	"github.com/compose-spec/compose-go/v2/cli"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

//	@title			Sledilka API
//	@version		1.0
//	@description	API for Sledilka service
//	@termsOfService	http://swagger.io/terms/

// @host      0.0.0.0:8081

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name X-Auth-Token
// @tokenUrl https://0.0.0.0:8081/token
// @scope.write Grants write access
// @scope.admin Grants read and write access to administrative information

func main() {
	ctx := context.Background()

	composeFilePath := "docker-compose.yaml"
	projectName := "sledilka"

	options, err := cli.NewProjectOptions(
		[]string{composeFilePath},
		cli.WithOsEnv,
		cli.WithDotEnv,
		cli.WithName(projectName),
	)
	if err != nil {
		log.Fatal(err)
	}

	project, err := options.LoadProject(ctx)
	if err != nil {
		log.Fatal(err)
	}

	dbInfo, err := project.GetService("db")
	if err != nil {
		log.Fatal(err)
	}

	tokenerInfo, err := project.GetService("token-service")
	if err != nil {
		log.Fatal(err)
	}

	//networkerInfo, err := project.GetService("networking-service")
	//if err != nil {
	//	log.Fatal(err)
	//}

	streamingInfo, err := project.GetService("streaming-service")
	if err != nil {
		log.Fatal(err)
	}

	DBConnection, err := db.StartupDB(ctx, dbInfo)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("DB started")

	conn, err := grpc.Dial(
		fmt.Sprintf("%s:%v",
			//"0.0.0.0",
			tokenerInfo.Name,
			tokenerInfo.Ports[0].Published),
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.Fatal(err)
	}
	tokenerClient := tokener.NewTokenerClient(conn)

	//conn, err = grpc.Dial(
	//	fmt.Sprintf("%s:%v", "0.0.0.0", 8282),
	//	grpc.WithTransportCredentials(insecure.NewCredentials()),
	//)
	//
	//networkerClient := network.NewNetworkClient(conn)
	ctrl := gomock.NewController(MockLogger{})
	subscribeClient := mock_network.NewMockNetwork_SubscribeClient(ctrl)
	subscribeClient.EXPECT().Recv().DoAndReturn(
		func() (*network.DeviceStatus, error) {
			time.Sleep(10 * time.Second)
			log.Println("taking random device from db")
			dev, err := dbmodel.New(DBConnection).GetRandomDevice(ctx)
			if err != nil {
				return nil, sql.ErrNoRows
			}
			return &network.DeviceStatus{
				MacAddress: dev.MacAddress,
				IsActive:   utils.RandBool(),
				IpAddress:  dev.IpAddress,
			}, nil
		},
	).AnyTimes()
	networkerClient := mock_network.NewMockNetworkClient(ctrl)
	networkerClient.EXPECT().Subscribe(gomock.Any(), gomock.Any()).Return(subscribeClient, nil).AnyTimes()
	networkerClient.EXPECT().GetAllMacAddresses(gomock.Any(), gomock.Any()).DoAndReturn(
		func(ctx context.Context, in *network.Empty, opts ...grpc.CallOption) (*network.GetAllMacAddressesResponse, error) {
			macs, err := dbmodel.New(DBConnection).GetAllDevicesMacs(ctx)
			if err != nil {
				return nil, errors.New("db error")
			}
			resp := &network.GetAllMacAddressesResponse{
				Devices: make([]*network.DeviceStatus, 0, len(macs)),
			}
			for _, mac := range macs {
				resp.Devices = append(resp.Devices, &network.DeviceStatus{
					MacAddress: mac,
					IsActive:   utils.RandBool(),
					IpAddress:  conv.StringToStringp("127.0.0.1"),
				})
			}
			for i := 0; i < 7-len(macs); i++ {
				resp.Devices = append(resp.Devices, &network.DeviceStatus{
					MacAddress: GenerateMac().String(),
					IsActive:   true,
					IpAddress:  conv.StringToStringp("127.0.0.1"),
				})
			}
			return resp, nil
		},
	).AnyTimes()

	networkerClient.EXPECT().IsActiveListDevice(gomock.Any(), gomock.Any()).DoAndReturn(
		func(_ context.Context, req *network.IsActiveListDeviceRequest, _ ...grpc.CallOption) (*network.IsActiveListDeviceResponse, error) {
			resp := &network.IsActiveListDeviceResponse{
				Devices: make([]*network.DeviceStatus, 0, len(req.GetDevices())),
			}
			for _, dev := range req.GetDevices() {
				resp.Devices = append(resp.Devices, &network.DeviceStatus{
					MacAddress: dev.GetMacAddress(),
					IsActive:   utils.RandBool(),
					IpAddress:  conv.StringToStringp("127.0.0.1"),
				})
			}
			return resp, nil
		},
	).AnyTimes()

	app := sledilka.New(
		DBConnection,
		tokenerClient,
		networkerClient,
		//fmt.Sprintf("http://0.0.0.0:%v/", 8181),
		fmt.Sprintf("http://%v:%v/", streamingInfo.Name, streamingInfo.Ports[0].Published),
		"0.0.0.0:8081")
	log.Fatal(app.Run())
}

type MockLogger struct{}

func (m MockLogger) Errorf(format string, args ...interface{}) {
	log.Printf(format, args...)
}

func (m MockLogger) Fatalf(format string, args ...interface{}) {
	log.Fatalf(format, args...)
}

func GenerateMac() net.HardwareAddr {
	buf := make([]byte, 6)
	var mac net.HardwareAddr

	_, err := rand.Read(buf)
	if err != nil {
	}

	// Set the local bit
	buf[0] |= 2

	mac = append(mac, buf[0], buf[1], buf[2], buf[3], buf[4], buf[5])

	return mac
}
