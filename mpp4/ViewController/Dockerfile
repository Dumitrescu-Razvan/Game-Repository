#Build stage
FROM rust:latest as builder


#install rust nightly
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

RUN rustup install nightly

RUN rustup default nightly

WORKDIR /app

COPY . .

#build the project
RUN cargo build --release

#production
FROM ubuntu:latest

WORKDIR /usr/local/bin

#copy the built binary from the build stage
COPY --from=builder /app/target/release/my-rocket-app .

#install the necessary dependencies
RUN apt-get update && apt-get install -y libpq-dev

#run the binary
CMD ["./my-rocket-app"]