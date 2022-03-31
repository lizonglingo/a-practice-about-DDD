package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"strconv"
	"time"
)

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	log.Fatal(http.ListenAndServe(":9090", nil))
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	u := &websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // 关闭同源访问限制
		},
	}
	conn, err := u.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("cannot upgrade: %v\n", err)
		return
	}
	defer conn.Close()

	done := make(chan struct{})	// 用来通知在连接挂掉后不再发消息
	go func() {
		for {
			m := make(map[string]interface{})
			err := conn.ReadJSON(&m)
			if err != nil {
				if !websocket.IsCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
					fmt.Printf("unexpected read error: %v\n", err)
				}

				done <- struct{}{}
				break
			}
			fmt.Printf("msg received: %v\n", m)
		}
	}()

	i := 0
	for {
		select {
		case <- time.After(200 * time.Millisecond):
		case <- done:
			return
		}
		i++
		err := conn.WriteJSON(map[string]string{
			"hello":  "websocket",
			"msg_id": strconv.Itoa(i),
		})
		if err != nil {
			fmt.Printf("cannot write json: %v\n", err)
		}

	}

}
