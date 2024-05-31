use diesel::prelude::*;
use serde::{Deserialize,Serialize};
use crate::schema::users;

#[derive(Serialize,Queryable,Debug)]
#[serde(crate="rocket::serde")]
pub struct User{
    pub id: i32,
    pub username: String,
    pub password: String,
    pub email: String,
}

#[derive(Insertable,Deserialize,AsChangeset)]
#[diesel(table_name=users)]
#[serde(crate="rocket::serde")]
pub struct NewUser{
    pub username: String,
    pub password: String,
    pub email: String,
}

#[derive(Insertable,Deserialize,AsChangeset)]
#[diesel(table_name=users)]
#[serde(crate="rocket::serde")]
pub struct VerifyUser{
    pub username: String,
    pub password: String,
}