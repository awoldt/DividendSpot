FROM golang:1.25.0-alpine3.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

# installs the "templ" command
RUN go install github.com/a-h/templ/cmd/templ@latest 
CMD ["templ", "generate"]

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
# template pages
COPY --from=builder /app/views ./views 
# static html pages
COPY --from=builder /app/about.html . 
COPY --from=builder /app/privacy.html . 

CMD ["./main"]
