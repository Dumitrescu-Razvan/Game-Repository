use rocket::http::CookieJar;
use rocket::serde::json::Json;
use crate::model::{Game, NewGame, UpdateGame, NewCompany, UpdateCompany, Company};
use crate::repo::GameRepository;
use crate::user_model::{User, VerifyUser, NewUser, UpdateUser};
use crate::user_repo::{Claims, UserRepository};
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
pub fn get_all_games(repo: &State<GameRepository>,user_repo: &State<UserRepository>, cookies : &CookieJar<'_>) -> Json<Vec<Game>> {
    let id: i32 = authorize_cookie(cookies, user_repo).unwrap().into_inner();
    Json(repo.get_all_games())
}
#[get("/games/<id>")]
pub fn get_by_id(id: i32, repo: &State<GameRepository>,user_repo: &State<UserRepository>,cookies : &CookieJar<'_>) -> Option<Json<Game>> {
    authorize_cookie(cookies, user_repo).unwrap();
    repo.get_game_by_id(id).map(Json)
}

#[post("/games", format = "json", data = "<game>")]
pub fn create(game: Json<NewGame>, repo: &State<GameRepository>,user_repo: &State<UserRepository>,cookies : &CookieJar<'_>) -> Json<Game> {
    let id : i32 = authorize_cookie(cookies, user_repo).unwrap().into_inner();
    let mut game = game.into_inner();
    Json(repo.create_game(game))
}

#[put("/games/<id>", format = "json", data = "<game>")]
pub fn update(id: i32, game: Json<UpdateGame>, repo: &State<GameRepository>,user_repo: &State<UserRepository>,cookies : &CookieJar<'_>) -> Option<Json<Game>> {
    authorize_cookie(cookies, user_repo).unwrap();
    repo.update_game(id, game.into_inner()).map(Json)
}

#[delete("/games/<id>")]
pub fn delete(id: i32, repo: &State<GameRepository>,user_repo: &State<UserRepository>,cookies : &CookieJar<'_>) -> Option<Json<Game>> {
    authorize_cookie(cookies, user_repo).unwrap();
    repo.delete_game(id).map(Json)
}

#[get("/companies")]
pub fn get_all_companies(repo: &State<GameRepository>,user_repo: &State<UserRepository>,cookies : &CookieJar<'_>) -> Json<Vec<Company>> {
    authorize_cookie(cookies, user_repo).unwrap();
    Json(repo.get_all_companies())
}

#[get("/companies/<id>")]
pub fn get_company_by_id(id: i32, repo: &State<GameRepository>,user_repo: &State<UserRepository>,cookies : &CookieJar<'_>) -> Option<Json<Company>> {
    authorize_cookie(cookies, user_repo).unwrap();
    repo.get_company_by_id(id).map(Json)
}

#[post("/companies", format = "json", data = "<company>")]
pub fn create_company(company: Json<NewCompany>, repo: &State<GameRepository>,user_repo: &State<UserRepository>,cookies : &CookieJar<'_>) -> Json<Company> {
    authorize_cookie(cookies, user_repo).unwrap();
    Json(repo.create_company(company.into_inner()))
}

#[put("/companies/<id>", format = "json", data = "<company>")]
pub fn update_company(id: i32, company: Json<UpdateCompany>, repo: &State<GameRepository>,user_repo: &State<UserRepository>,cookies : &CookieJar<'_>) -> Option<Json<Company>> {
    authorize_cookie(cookies, user_repo).unwrap();
    repo.update_company(id, company.into_inner()).map(Json)
}

#[delete("/companies/<id>")]
pub fn delete_company(id: i32, repo: &State<GameRepository>,user_repo: &State<UserRepository>,cookies : &CookieJar<'_>) -> Option<Json<Company>> {
    authorize_cookie(cookies, user_repo).unwrap();
    repo.delete_company(id).map(Json)
}

#[get("/users")]
pub fn get_all_users(repo: &State<UserRepository>) -> Json<Vec<User>> {
    Json(repo.get_all_users())
}

#[get("/users/<id>")]
pub fn get_user_by_id(id: i32, repo: &State<UserRepository>) -> Option<Json<User>> {
    repo.get_user_by_id(id).map(Json)
}

#[put("/users/<id>", format = "json", data = "<user>")]
pub fn update_user(id: i32, user: Json<UpdateUser>, repo: &State<UserRepository>) -> Option<Json<User>> {
    repo.update_user(id, user.into_inner()).map(Json)
}

#[delete("/users/<id>")]
pub fn delete_user(id: i32, repo: &State<UserRepository>) -> Option<Json<User>> {
    repo.delete_user(id).map(Json)
}



#[post("/login", format = "json", data = "<user>")]
pub fn login(user: Json<VerifyUser>, repo: &State<UserRepository>, cookies : &CookieJar<'_>) -> Result<Json<(String, String)>, String> {
    match repo.verify_user(&user.username, &user.password) {
        Ok((token, user_type)) => {
            cookies.add(rocket::http::Cookie::new("token", token.clone()));
            Ok(Json((token, user_type)))
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
                    type_: user.type_,
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

fn authorize_cookie(cookies : &CookieJar<'_>, repo: &State<UserRepository>) -> Result<Json<i32>, String> {
    let token = cookies.get("token");
    match token {
        Some(token) => {
            let token_data = decode::<Claims>(&token.value(), &DecodingKey::from_secret("secret".as_ref()), &Validation::new(Algorithm::HS256));
            match token_data {
                Ok(token_data) => {
                    let user = repo.get_user_by_id(token_data.claims.iss.parse().unwrap()).unwrap();
                    if token_data.claims.iss == user.id.to_string() && token_data.claims.sub == user.username && token_data.claims.exp > Local::now().timestamp() {
                        Ok((user.id).into())
                    } else {
                        Err("Invalid token".to_string())
                    }
                },
                Err(_) => Err("Invalid token".to_string())
            }
        },
        None => Err("No token".to_string())
    }
}