package main

import (
	"./hayaoshi"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var rooms = make(map[string]Room)

type Room struct {
	sessions map[*websocket.Conn]bool
	hayaoshi hayaoshi.Hayaoshi
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Message)
var upgrader = websocket.Upgrader{}

type Message struct {
	Type   string `json:"type"`
	RoomId string `json:"roomId"`
	OwnId  string `json:"OwnId"`
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	roomId := r.URL.Query().Get("roomId")

	if roomId == "" {
		// ルームIDが指定されていない
	}

	room, ok := rooms[roomId]
	if !ok {
		// ルームIDが存在しない
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}

	defer ws.Close()

	room.sessions[ws] = true
	// clients[ws] = true

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(room.sessions, ws)
			// delete(clients, ws)
			break
		}

		broadcast <- msg
	}
}

func main() {

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	http.HandleFunc("/ws", handleConnections)

	http.HandleFunc("/createNewRoom", func(response http.ResponseWriter, request *http.Request) {
		uuid := uuid.New()
		uuidString := uuid.String()
		rooms[uuidString] = Room{
			map[*websocket.Conn]bool{},
			hayaoshi.Hayaoshi{},
		}
	})

	go handleMessages()

	log.Println("http server started on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleMessages() {
	for {
		msg := <-broadcast

		room, ok := rooms[msg.RoomId]
		if !ok {
			// ルームが存在しない
		}

		switch msg.Type {
		case "joinSession":
			{
				room.hayaoshi.Players = append(room.hayaoshi.Players, hayaoshi.Player{})
			}
		case "pushButton":
			{
				hayaoshi.ButtonPushed(room.hayaoshi.Players, msg.OwnId)
			}
		case "reset":
			{
				hayaoshi.ResetPlayers(room.hayaoshi.Players)
			}
		}

		for client := range room.sessions {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
