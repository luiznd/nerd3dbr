package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/nerd3dbr/backend/internal/application/services"
	"github.com/nerd3dbr/backend/internal/infrastructure/repositories"
	"github.com/nerd3dbr/backend/internal/interfaces/http/handlers"
	"github.com/nerd3dbr/backend/internal/interfaces/http/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Carregar variáveis de ambiente
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, usando variáveis de ambiente do sistema")
	}

	// Configuração do MongoDB
	mongoURI := os.Getenv("DB_MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017/nerd3dbr"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// Inicialização do banco de dados
	db := client.Database("nerd3dbr")

	// Inicialização dos repositórios
 	productRepo := repositories.NewMongoProductRepository(db)
	userRepo := repositories.NewMongoUserRepository(db)
	orderRepo := repositories.NewMongoOrderRepository(db)
 
 	// Inicialização dos serviços
 	productService := services.NewProductService(productRepo)
	authService := services.NewAuthService(userRepo, "your-secret-key", 24*time.Hour)
	orderService := services.NewOrderService(orderRepo)

	// Middlewares
	authMiddleware := middleware.NewAuthMiddleware(authService)
 
 	// Inicialização dos handlers
 	productHandler := handlers.NewProductHandler(productService)
	authHandler := handlers.NewAuthHandler(authService)
	orderHandler := handlers.NewOrderHandler(orderService, authMiddleware)
 
 	// Configuração do Gin
 	router := gin.Default()

	// Configuração do CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", "http://frontend:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Rotas de produtos
 	api := router.Group("/api")
 	{
		authHandler.RegisterRoutes(api)
		productHandler.RegisterRoutes(api)
		orderHandler.RegisterRoutes(api)
 	}
 
 	// Iniciar o servidor
	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}