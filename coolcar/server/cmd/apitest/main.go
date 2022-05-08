package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

func main() {
	for i:=0; i<1000; i++ {
		time.Sleep(2 * time.Millisecond)
		go testAPI(i)
		go testCustomer(i)
		go testCards(i)
	}
	time.Sleep(100 * time.Second)


}

func testAPI(i int) {
	resp, err := http.Get("http://10.0.21.28:30001/catalogue")
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	s,err:=ioutil.ReadAll(resp.Body)
	fmt.Println(i)
	fmt.Printf(string(s))
}

func testCustomer(i int) {
	resp, err := http.Get("http://10.0.21.28:30001/customers")
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	s,err:=ioutil.ReadAll(resp.Body)
	fmt.Println(i)
	fmt.Printf(string(s))
}
func testCards(i int) {
	resp, err := http.Get("http://10.0.21.28:30001/cards")
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	s,err:=ioutil.ReadAll(resp.Body)
	fmt.Println(i)
	fmt.Printf(string(s))
}