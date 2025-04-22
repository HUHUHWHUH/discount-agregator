## Предварительные требования

- **Java 17** и выше
- **Maven 3.8+** 
- **Node.js 18+** и **npm**
- **Angular CLI 18.2.11**
- **Docker & Docker Compose**

---

## Клонирование репозитория
```
git clone https://github.com/HUHUHWHUH/discount-agregator.git   
cd discount-agregator
```

---

## Запуск через Docker Compose

1. При необходимости отредактируйте `docker-compose.yml`
2. Запустите все контейнеры: docker-compose up build

---

## Запуск сервисов на backend

Каждый сервис — Spring Boot‑приложение. Запустите сначала Config Server и Discovery Server, остальные сервисы можно запускать в любом порядке

---

## 🌐 Запуск фронтенда (Fiji UI)

```bash
cd fiji-ui
npm install
ng serve
```

Приложение будет доступно по адресу:  
```
http://localhost:4200
```  
