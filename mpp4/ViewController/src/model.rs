use diesel::prelude::*;
use fake::Opt;
use serde::{Deserialize, Serialize};
use crate::schema::{companies, games};


#[derive(Serialize, Queryable, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Game {
    pub id: i32,
    pub name: String,
    pub release_year: i32,
    pub rating: i32,
    pub company_id: i32,
}
#[derive(Serialize, Queryable, Debug)]
#[serde(crate = "rocket::serde")]
pub struct Company {
    pub id: i32,
    pub name: String,
    pub location: String,
}

#[derive(Insertable, Deserialize, AsChangeset)]
#[table_name = "games"]
#[serde(crate="rocket::serde")]
pub struct NewGame {
    pub name: String,
    pub release_year: i32,
    pub rating: i32,
    pub company_id: i32,
}

#[derive(Insertable, Deserialize, AsChangeset)]
#[table_name = "companies"]
#[serde(crate="rocket::serde")]
pub struct NewCompany {
    pub name: String,
    pub location: String,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "games"]
#[serde(crate="rocket::serde")]
pub struct UpdateGame {
    pub name: Option<String>,
    pub release_year: Option<i32>,
    pub rating: Option<i32>,
    pub company_id: Option<i32>,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "companies"]
#[serde(crate="rocket::serde")]
pub struct UpdateCompany {
    pub name: Option<String>,
    pub location: Option<String>,
}
