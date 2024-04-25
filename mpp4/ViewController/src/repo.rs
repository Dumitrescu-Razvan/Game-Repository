use fake::faker::company::raw::CompanyName;
use fake::faker::address::raw::CountryName;
use fake::faker::lorem;
use fake::locales::EN;
use fake::Fake;
use rand::prelude::*;

use diesel::pg::PgConnection;
use diesel::prelude::*;

use std::sync::Arc;
use std::sync::Mutex;

use crate::model::{Company, Game, NewCompany, NewGame, UpdateCompany, UpdateGame};
use crate::schema::{companies, games};

pub struct GameRepository {
    conn: Arc<Mutex<PgConnection>>,
}

impl GameRepository {
    pub fn new(database_url: &str) -> Self {
        let conn = PgConnection::establish(database_url)
            .expect(&format!("Error connecting to {}", database_url));
        GameRepository { conn: Arc::new(Mutex::new(conn)) }
    }

    pub fn get_all_games(&self) -> Vec<Game> {
        let mut conn = self.conn.lock().unwrap();
        games::table.load::<Game>(&mut *conn).expect("Error loading games")
    }

    pub fn get_all_companies(&self) -> Vec<Company> {
        let mut conn = self.conn.lock().unwrap();
        companies::table.load::<Company>(&mut *conn).expect("Error loading companies")
    }

    pub fn get_game_by_id(&self, id: i32) -> Option<Game> {
        let mut conn = self.conn.lock().unwrap();
        games::table.find(id).first::<Game>(&mut *conn).ok()
    }

    pub fn get_company_by_id(&self, id: i32) -> Option<Company> {
        let mut conn = self.conn.lock().unwrap();
        companies::table.find(id).first::<Company>(&mut *conn).ok()
    }

    pub fn create_game(&self, new_game: NewGame) -> Game {
        let mut conn = self.conn.lock().unwrap();
        diesel::insert_into(games::table)
            .values(&new_game)
            .get_result(&mut *conn)
            .expect("Error saving new game")
    }

    pub fn create_company(&self, new_company: NewCompany) -> Company {
        let mut conn = self.conn.lock().unwrap();
        diesel::insert_into(companies::table)
            .values(&new_company)
            .get_result(&mut *conn)
            .expect("Error saving new company")
    }

    pub fn update_game(&self, id: i32, update_game: UpdateGame) -> Option<Game> {
        let mut conn = self.conn.lock().unwrap();
        diesel::update(games::table.find(id))
            .set(&update_game)
            .get_result(&mut *conn)
            .ok()
    }

    pub fn update_company(&self, id: i32, update_company: UpdateCompany) -> Option<Company> {
        let mut conn = self.conn.lock().unwrap();
        diesel::update(companies::table.find(id))
            .set(&update_company)
            .get_result(&mut *conn)
            .ok()
    }

    pub fn delete_game(&self, id: i32) -> Option<Game> {
        let mut conn = self.conn.lock().unwrap();
        let game = games::table.find(id).first::<Game>(&mut *conn).ok();
        diesel::delete(games::table.find(id))
            .execute(&mut *conn)
            .ok()
            .and_then(|_| game)
    }

    pub fn delete_company(&self, id: i32) -> Option<Company> {
        let mut conn = self.conn.lock().unwrap();
        let company = companies::table.find(id).first::<Company>(&mut *conn).ok();
        diesel::delete(companies::table.find(id))
            .execute(&mut *conn)
            .ok()
            .and_then(|_| company)
    }


    pub fn generate_fake_data(&self, num_games: i32, num_companies: i32) {
        let mut rng = rand::thread_rng();

        for _ in 0..num_companies {
            let company = NewCompany {
                name: CompanyName(EN).fake_with_rng(&mut rng),
                location: CountryName(EN).fake_with_rng(&mut rng),
            };
            self.create_company(company);
        }

        for _ in 0..num_games {
            let game = NewGame {
                name: lorem::en::Sentence(1..3).fake_with_rng(&mut rng),
                release_year: rng.gen_range(1980..2022),
                rating: rng.gen_range(1..11),
                company_id: rng.gen_range(1..num_companies + 1),
            };
            self.create_game(game);
        }
    }


}
