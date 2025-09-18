FROM golang:1.25.0-alpine3.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

FROM alpine:3.22

WORKDIR /app

# go binary
COPY --from=builder /app/main .
# env variables
COPY --from=builder /app/.env .
# images, scripts, css, etc...
COPY --from=builder /app/public ./public
# contains very important json files that site needs to work  
COPY --from=builder /app/misc ./misc 
# html pages
COPY --from=builder /app/views ./views 

CMD ["./main"]
