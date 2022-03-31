package ws

import (
	"context"
	"coolcar/car/mq"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
	"net/http"
)

// Handler create a websocket http handler.
func Handler(u *websocket.Upgrader, sub mq.Subscriber, logger *zap.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//u := &websocket.Upgrader{
		//	CheckOrigin: func(r *http.Request) bool {
		//		return true // 关闭同源访问限制
		//	},
		//}
		conn, err := u.Upgrade(w, r, nil)
		if err != nil {
			logger.Warn("cannot upgrade", zap.Error(err))
			return
		}
		defer conn.Close()

		// 配置MQ
		msgs, cleanUp, err := sub.Subscribe(context.Background())
		if err != nil {
			logger.Error("cannot subscribe", zap.Error(err))
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer cleanUp()

		done := make(chan struct{}) // 用来通知在连接挂掉后不再发消息
		go func() {
			for {
				_, _, err := conn.ReadMessage()
				if err != nil {
					if !websocket.IsCloseError(err,
						websocket.CloseGoingAway,
						websocket.CloseNormalClosure) {
						logger.Warn("unexpected read error", zap.Error(err))
					}
					done <- struct{}{}
					break
				}
			}
		}()


		for {
			select {
			case msg := <- msgs:
				err := conn.WriteJSON(msg)
				if err != nil {
					logger.Warn("cannot read json", zap.Error(err))
				}
			case <-done:
				return
			}
		}
	}
}
