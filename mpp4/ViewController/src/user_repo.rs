use chrono::Local;
use diesel::prelude::*;
use diesel::pg::PgConnection;

use std::sync::Arc;
use std::sync::Mutex;

use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};

use serde::{Serialize, Deserialize};

use crate::user_model::UpdateUser;
use crate::user_model::{User, NewUser};
use crate::schema::users;

pub struct UserRepository {
    conn: Arc<Mutex<PgConnection>>,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims{
    pub iss: String,
    pub sub: String,
    pub iat:i64,
    pub exp: i64,
    pub type_: Option<i32>,
}

impl UserRepository{
    pub fn new(database_url: &str) -> Self {
        let conn = PgConnection::establish(database_url)
            .expect(&format!("Error connecting to {}", database_url));
        UserRepository { conn: Arc::new(Mutex::new(conn)) }
    }

    pub fn get_all_users(&self) -> Vec<User> {
        let mut conn = self.conn.lock().unwrap();
        users::table.load::<User>(&mut *conn).expect("Error loading users")
    }

    pub fn get_user_by_id(&self, id: i32) -> Option<User> {
        let mut conn = self.conn.lock().unwrap();
        users::table.find(id).first::<User>(&mut *conn).ok()
    }

    pub fn get_user_by_username(&self, username: &str) -> Option<User> {
        let mut conn = self.conn.lock().unwrap();
        users::table.filter(users::username.eq(username)).first::<User>(&mut *conn).ok()
    }

    pub fn create_user(&self, new_user: NewUser) -> User {
        let mut conn = self.conn.lock().unwrap();
        diesel::insert_into(users::table)
            .values(&new_user)
            .get_result(&mut *conn)
            .expect("Error saving new user")
    }

    pub fn update_user(&self, id: i32, new_user: UpdateUser) -> Option<User> {
        let mut conn = self.conn.lock().unwrap();
        diesel::update(users::table.find(id))
            .set(&new_user)
            .get_result(&mut *conn)
            .ok()
    }

    pub fn delete_user(&self, id: i32) -> Option<User> {
        let mut conn = self.conn.lock().unwrap();
        diesel::delete(users::table.find(id))
            .get_result(&mut *conn)
            .ok()
    }

    pub fn verify_user(&self, username: &str, password: &str) -> Result<(String, String), String> {
        let mut conn = self.conn.lock().unwrap();
        let user = users::table.filter(users::username.eq(username))
            .first::<User>(&mut *conn)
            .ok();
        
        match user {
            Some(user) => {
                if user.password == password {
                    let now = Local::now();
                    let iat = now.timestamp();
                    let exp = (now + chrono::Duration::minutes(20)).timestamp();
                    let claims = Claims{
                        iss: user.id.to_string(),
                        sub: user.username,
                        iat,
                        exp,
                        type_: user.type_,
                    };
                    let token = encode(&Header::default(), &claims, &EncodingKey::from_secret("secret".as_ref()));
                    //print the decoded token
                    let tokencopy = token.clone();
                    let token_data = decode::<Claims>(&tokencopy.unwrap(), &DecodingKey::from_secret("secret".as_ref()), &Validation::default());
                    println!("{:?}", token_data);
                    Ok((token.unwrap(), user.type_.unwrap().to_string()))
                } else {
                    Err("Wrong password".to_string())
                }
            },
            None => Err("Wrong username".to_string())
        }
    }

}