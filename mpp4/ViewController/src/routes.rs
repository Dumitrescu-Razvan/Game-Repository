use rocket::http::CookieJar;
use rocket::serde::json::Json;
use crate::model::{Game, NewGame, UpdateGame, NewCompany, UpdateCompany, Company};
use crate::repo::GameRepository;
use crate::user_model::{User, VerifyUser, NewUser};
use crate::user_repo::{UserRepository, Claims};
use rocket::State;
use jsonwebtoken::{decode, Validation, Algorithm, DecodingKey};
use chrono::{Utc, Duration, Local};
use serde::Deserialize;



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

#[post("/login", format = "json", data = "<user>")]
pub fn login(user: Json<VerifyUser>, repo: &State<UserRepository>, cookies : &CookieJar<'_>) -> Result<Json<String>, String> {
    match repo.verify_user(&user.username, &user.password) {
        Ok(token) => {
            cookies.add(rocket::http::Cookie::new("token", token.clone()));
            Ok(Json(token))
        },
        Err(e) => Err(e)
        
    }
}

#[post("/register", format = "json", data = "<user>")]
pub fn register(user: Json<NewUser>, repo: &State<UserRepository>) -> Json<User> {
    Json(repo.create_user(user.into_inner()))
}

#[derive(Deserialize)]
pub struct AuthData {
    token: String,
    username: String,
}

//authorize user
#[post("/authorize", format = "json", data = "<data>")]
pub fn authorize(data: Json<AuthData>, repo: &State<UserRepository>) -> Result<Json<String>, String> {
    let token = &data.token;
    let username = &data.username;
    // find user by username
    let user = repo.get_user_by_username(&username).unwrap();
    let token_data = decode::<Claims>(&token, &DecodingKey::from_secret("secret".as_ref()), &Validation::new(Algorithm::HS256));
    match token_data {
        Ok(token_data) => {
            if token_data.claims.iss == user.id.to_string() && token_data.claims.sub == user.username && token_data.claims.exp > Local::now().timestamp() {
                let now = Utc::now();
                let iat = now.timestamp();
                let exp = (now + Duration::hours(1)).timestamp();
                let _claims = Claims{
                    iss: user.id.to_string(),
                    sub: user.username,
                    iat,
                    exp,
                };
                // let token = encode(&Header::default(), &claims, &EncodingKey::from_secret("secret".as_ref()));
                // print!("{:?}\n", token_data.claims.exp);
                // print!("{:?}\n", Local::now().timestamp());
            
                Ok(Json("Authorized".to_string()))
            } else {
                Err("Invalid token".to_string())
            }
        },
        Err(_) => Err("Invalid token".to_string())
    }
}
