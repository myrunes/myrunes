package webserver

import (
	"errors"

	"github.com/zekroTJA/lol-runes/internal/database"

	routing "github.com/qiangxue/fasthttp-routing"
	"github.com/valyala/fasthttp"
)

// Error Objects
var (
	errNotFound         = errors.New("not found")
	errInvalidArguments = errors.New("invalid arguments")
	errUNameInUse       = errors.New("user name already in use")
)

// Static File Handlers
var (
	fileHandlerStatic = fasthttp.FS{
		Root:       "./web/dist",
		IndexNames: []string{"index.html"},
		// PathRewrite: func(ctx *fasthttp.RequestCtx) []byte {
		// 	return ctx.Path()[7:]
		// },
	}
)

type Config struct {
	Addr string     `json:"addr"`
	TLS  *TLSConfig `json:"tls"`
}

type TLSConfig struct {
	Enabled bool   `json:"enabled"`
	Cert    string `json:"certfile"`
	Key     string `json:"keyfile"`
}

type WebServer struct {
	server *fasthttp.Server
	router *routing.Router

	db   database.Middleware
	auth *Authorization

	config *Config
}

func NewWebServer(db database.Middleware, config *Config) (ws *WebServer) {
	ws = new(WebServer)

	ws.config = config
	ws.db = db
	ws.auth = NewAuthorization(db)
	ws.router = routing.New()
	ws.server = &fasthttp.Server{
		Handler: ws.router.HandleRequest,
	}

	ws.registerHandlers()

	return
}

func (ws *WebServer) registerHandlers() {
	ws.router.Use(ws.handlerFiles)

	api := ws.router.Group("/api")
	api.Use(ws.addCORSHeaders)
	api.Post("/login", ws.handlerLogin)

	users := api.Group("/users")
	users.
		Post("/me", ws.handlerCreateUser).
		Get(ws.auth.CheckRequestAuth, ws.handlerGetMe)
}

func (ws *WebServer) ListenAndServeBlocking() error {
	tls := ws.config.TLS

	if tls.Enabled {
		if tls.Cert == "" || tls.Key == "" {
			return errors.New("cert file and key file must be specified")
		}
		return ws.server.ListenAndServeTLS(ws.config.Addr, tls.Cert, tls.Key)
	}

	return ws.server.ListenAndServe(ws.config.Addr)
}
