#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
extern crate dotenv;

use std::sync::Arc;
use std::env;
use diesel::connection;
use rocket::http::Method;
use rocket::Config;
use rocket_cors::{AllowedOrigins, CorsOptions};
use tokio::sync::Mutex;

use rocket::futures::SinkExt;
use rocket::futures::StreamExt;
use tokio::net::TcpListener;
use tokio_tungstenite::tungstenite::protocol::Message;

use dotenv::dotenv;

mod model;
mod repo;
mod routes;
mod tests;
mod schema;
mod userRepo;
mod userModel;

use repo::GameRepository;
use routes::*;
use userRepo::UserRepository;

#[rocket::main]
async fn main() {
    dotenv().ok();
    let connection = env::var ("DATABASE_URL").expect("DATABASE_URL must be set");
    
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

    let game_repository = GameRepository::new(&connection);
    let user_repository = UserRepository::new(&connection);
    //game_repository.generate_fake_data(10, 10);

    let ws_repo = GameRepository::new(&connection);

    let ws_task = tokio::spawn(async move {
        let listener = TcpListener::bind("localhost:3002").await.unwrap();
        println!("Listening on: {}", listener.local_addr().unwrap());

        loop {
            let (stream, _) = listener.accept().await.unwrap();
            let repo = GameRepository::new(&connection);
            tokio::spawn(accept_connection(stream));
        }
    });
    
    rocket::custom(config)
        .manage(game_repository)
        .manage(user_repository)
        .attach(cors)
        .mount("/", routes![index, get_all_games, get_by_id, create, update, delete, get_all_companies, get_company_by_id, create_company, update_company, delete_company, login, register])
        .launch()
        .await
        .unwrap();

    let _ = tx.send(());

  //  let _ = ws_task.await;
}

async fn accept_connection(stream: tokio::net::TcpStream) {
    let ws_stream = tokio_tungstenite::accept_async(stream)
        .await
        .expect("Error during websocket handshake");

    println!("WebSocket connection established");

    let (mut write, _) = ws_stream.split();

    println!("WebSocket connection split");

    loop {
        tokio::time::sleep(std::time::Duration::from_secs(5)).await;
        //let mut _repo = _repo.lock().await;
        //let games = _repo.create_random_games(10);
        //println!("Sending message");
        //send the games to the client
        //write.send(Message::text("Hello from the server")).await.unwrap();
    }
}
