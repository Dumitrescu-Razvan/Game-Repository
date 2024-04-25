use rocket::serde::json::Json;
use crate::model::{Game, NewGame, UpdateGame, NewCompany, UpdateCompany, Company};
use crate::repo::GameRepository;
use rocket::State;

#[get("/")]
pub fn index() -> &'static str {
    // Return a static string
    "Hello, world!"
}

#[get("/games")]
pub fn get_all_games(repo: &State<GameRepository>) -> Json<Vec<Game>> {
    Json(repo.get_all_games())
}
#[get("/games/<id>")]
pub fn get_by_id(id: i32, repo: &State<GameRepository>) -> Option<Json<Game>> {
    repo.get_game_by_id(id).map(Json)
}

#[post("/games", format = "json", data = "<game>")]
pub fn create(game: Json<NewGame>, repo: &State<GameRepository>) -> Json<Game> {
    Json(repo.create_game(game.into_inner()))
}

#[put("/games/<id>", format = "json", data = "<game>")]
pub fn update(id: i32, game: Json<UpdateGame>, repo: &State<GameRepository>) -> Option<Json<Game>> {
    repo.update_game(id, game.into_inner()).map(Json)
}

#[delete("/games/<id>")]
pub fn delete(id: i32, repo: &State<GameRepository>) -> Option<Json<Game>> {
    repo.delete_game(id).map(Json)
}

#[get("/companies")]
pub fn get_all_companies(repo: &State<GameRepository>) -> Json<Vec<Company>> {
    Json(repo.get_all_companies())
}

#[get("/companies/<id>")]
pub fn get_company_by_id(id: i32, repo: &State<GameRepository>) -> Option<Json<Company>> {
    repo.get_company_by_id(id).map(Json)
}

#[post("/companies", format = "json", data = "<company>")]
pub fn create_company(company: Json<NewCompany>, repo: &State<GameRepository>) -> Json<Company> {
    Json(repo.create_company(company.into_inner()))
}

#[put("/companies/<id>", format = "json", data = "<company>")]
pub fn update_company(id: i32, company: Json<UpdateCompany>, repo: &State<GameRepository>) -> Option<Json<Company>> {
    repo.update_company(id, company.into_inner()).map(Json)
}

#[delete("/companies/<id>")]
pub fn delete_company(id: i32, repo: &State<GameRepository>) -> Option<Json<Company>> {
    repo.delete_company(id).map(Json)
}



// #[post("/setgames", format = "json", data = "<games>")]
// pub fn set_games(games: Json<Vec<Game>>, repo: &State<GameRepository>) {
//     // let games = games.into_inner();
//     // repo.set_games(games);

// }
