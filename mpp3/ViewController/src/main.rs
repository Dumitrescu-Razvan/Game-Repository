#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use std::sync::Arc;
use rocket::http::Method;
use rocket::Config;
use rocket_cors::{AllowedOrigins, CorsOptions};
use tokio::sync::Mutex;

use rocket::futures::SinkExt;
use rocket::futures::StreamExt;
use tokio::net::TcpListener;
use tokio_tungstenite::tungstenite::protocol::Message;

mod model;
mod repo;
mod routes;
mod tests;

use repo::GameRepository;
use routes::*;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = tokio::sync::oneshot::channel();

    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec![
                Method::Get,
                Method::Post,
                Method::Put,
                Method::Delete,
                Method::Options,
            ]
            .into_iter()
            .map(From::from)
            .collect(),
        )
        .allow_credentials(true)
        .to_cors()
        .expect("CORS configuration failed");

    let config = Config::figment().merge(("port", 3001));

    let game_repository = Arc::new(Mutex::new(GameRepository::new(None)));


    let ws_repo = Arc::clone(&game_repository);

    let ws_task = tokio::spawn(async move {
        let listener = TcpListener::bind("localhost:3002").await.unwrap();
        println!("Listening on: {}", listener.local_addr().unwrap());

        loop {
            tokio::select! {
                Ok((stream, _)) = listener.accept() => {
                    tokio::spawn(accept_connection(stream, Arc::clone(&ws_repo)));
                }

                _ = &mut rx =>{
                    break;
                }
            }
        }
    });

    //let http_repo = Arc::clone(&game_repository);
    let game_repository = GameRepository::new(None);
    
    rocket::custom(config)
        .manage(game_repository)
        .attach(cors)
        .mount("/", routes![index, get_all, get_by_id, create, update, delete, set_games])
        .launch()
        .await
        .unwrap();

    let _ = tx.send(());

    let _ = ws_task.await;
}

async fn accept_connection(stream: tokio::net::TcpStream, _repo: Arc<Mutex<GameRepository>>) {
    let ws_stream = tokio_tungstenite::accept_async(stream)
        .await
        .expect("Error during websocket handshake");

    println!("WebSocket connection established");

    let (mut write, _) = ws_stream.split();

    println!("WebSocket connection split");

    loop {
        tokio::time::sleep(std::time::Duration::from_secs(5)).await;
        let mut _repo = _repo.lock().await;
        let games = _repo.create_random_games(10);
        println!("Sending message");
        //send the games to the client
        write.send(Message::Text(serde_json::to_string(&games).unwrap())).await.unwrap();

    }
}
