use rocket::serde::json::Json;
use crate::model::Game;
use crate::repo::GameRepository;
use rocket::State;

#[get("/")]
pub fn index() -> &'static str {
    // Return a static string
    "Hello, world!"
}

#[get("/games")]
pub fn get_all(repo: &State<GameRepository>) -> Json<Vec<Game>> {
    Json(repo.get_all())
}

#[get("/games/<id>")]
pub fn get_by_id(id: i32, repo: &State<GameRepository>) -> Option<Json<Game>> {
    repo.get_by_id(id).map(Json)
}

#[post("/games", format = "json", data = "<game>")]
pub fn create(game: Json<Game>, repo: &State<GameRepository>) -> Json<Game> {
    Json(repo.create(game.into_inner()))
}

#[put("/games/<id>", format = "json", data = "<game>")]
pub fn update(id: i32, game: Json<Game>, repo: &State<GameRepository>) -> Option<Json<Game>> {
    repo.update(id, game.into_inner()).map(Json)
}

#[delete("/games/<id>")]
pub fn delete(id: i32, repo: &State<GameRepository>) -> Option<Json<Game>> {
    repo.delete(id).map(Json)
}

#[post("/setgames", format = "json", data = "<games>")]
pub fn set_games(games: Json<Vec<Game>>, repo: &State<GameRepository>) {
    let games = games.into_inner();
    repo.set_games(games);

}