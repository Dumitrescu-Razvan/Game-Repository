use diesel::prelude::*;
use diesel::pg::PgConnection;

use std::sync::Arc;
use std::sync::Mutex;

use jsonwebtoken::{encode, decode, Header, Validation, Algorithm, EncodingKey, DecodingKey};

use crate::userModel::{User, NewUser};
use crate::schema::users;

pub struct UserRepository {
    conn: Arc<Mutex<PgConnection>>,
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

    pub fn create_user(&self, new_user: NewUser) -> User {
        let mut conn = self.conn.lock().unwrap();
        diesel::insert_into(users::table)
            .values(&new_user)
            .get_result(&mut *conn)
            .expect("Error saving new user")
    }

    pub fn verify_user(&self, username: &str, password: &str) -> Result<String, String> {
        let mut conn = self.conn.lock().unwrap();
        let user = users::table.filter(users::username.eq(username))
            .first::<User>(&mut *conn)
            .ok();
        
        match user {
            Some(user) => {
                if user.password == password {
                    //send token
                    let token = encode(&Header::default(), &user, &EncodingKey::from_secret("secret".as_ref()));
                    Ok(token.unwrap())
                } else {
                    Err("Wrong password".to_string())
                }
            },
            None => Err("Wrong username".to_string())
        }
    }
}