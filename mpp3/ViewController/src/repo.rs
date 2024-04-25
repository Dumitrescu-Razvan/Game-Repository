use std::sync::{Arc, Mutex};
use std::sync::atomic::AtomicUsize;

use rand::prelude::*;
use fake::faker::internet::en::*;
use fake::Fake;
use std::sync::atomic::Ordering;

use crate::model::Game;

pub struct GameRepository {
    games: Mutex<Vec<Game>>,
    callback: Option<Arc<dyn Fn() -> () + Send + Sync>>,
    counter: AtomicUsize,
}

impl GameRepository {
    pub fn new(callback: Option<Arc<dyn Fn() -> () + Send + Sync>>) -> GameRepository {
        GameRepository {
            games: Mutex::new(vec![
                Game {
                    id: 0,
                    title: "The Legend of Zelda: Ocarina of Time".to_string(),
                    year: 1998,
                    rating: 99.0,
                },
                Game {
                    id: 1,
                    title: "Super Mario 64".to_string(),
                    year: 1996,
                    rating: 94.0,
                },
                Game {
                    id: 2,
                    title: "GoldenEye 007".to_string(),
                    year: 1997,
                    rating: 96.0,
                },
                Game {
                    id: 3,
                    title: "Perfect Dark".to_string(),
                    year: 2000,
                    rating: 97.0,
                },
                Game {
                    id: 4,
                    title: "The Legend of Zelda: Majora's Mask".to_string(),
                    year: 2000,
                    rating: 95.0,
                },
            ]),
            callback,
            counter: AtomicUsize::new(0),
        }
    }

    fn invoke_callback(&self) {
        if let Some(callback) = &self.callback {
            callback(); // Call the callback function if it exists
        }
    }

    pub fn get_all(&self) -> Vec<Game> {
        self.games.lock().unwrap().clone()
    }

    pub fn get_by_id(&self, id: i32) -> Option<Game> {
        let games = self.games.lock().unwrap();
        games.iter().find(|g| g.id == id).cloned()
    }

    pub fn create(&self, game: Game) -> Game {
        let mut games = self.games.lock().unwrap();
        let id = games.last().map_or(0, |g| g.id + 1);
        let new_game = Game { id, title: game.title, year: game.year, rating: game.rating };
        games.push(new_game.clone());
        self.invoke_callback(); 
        new_game
    }

    pub fn update(&self, id: i32, game: Game) -> Option<Game> {
        let mut games = self.games.lock().unwrap();
        if let Some(index) = games.iter().position(|g| g.id == id) {
            games[index] = game.clone();
            self.invoke_callback(); 
            Some(game)
        } else {
            None
        }
    }

    pub fn delete(&self, id: i32) -> Option<Game> {
        let mut games = self.games.lock().unwrap();
        if let Some(index) = games.iter().position(|g| g.id == id) {
            let removed_game = games.remove(index);
            self.invoke_callback(); // Call the callback function
            Some(removed_game)
        } else {
            None
        }
    }


    pub fn create_random_games(&self, n: i32) -> Vec<Game> {
        // Generate n random games and add them to the list
        let mut games = self.games.lock().unwrap();
        let mut rng = rand::thread_rng();
        let mut new_games = vec![];
        let mut id = self.counter.fetch_add(n as usize, Ordering::SeqCst) as i32;
        for _ in 0..n {
            id += 1;
            let title = Username().fake();
            let year = rng.gen_range(1980..2022);
            let rating = rng.gen_range(0..=100) as f32 + rng.gen_range(0..=9) as f32 / 10.0;
            let new_game = Game { id, title, year, rating };
            games.push(new_game.clone());
            new_games.push(new_game);
        }
        self.invoke_callback();
        games.clone()
    }

    pub fn set_games(&self, new_games: Vec<Game>) {
        let mut games = self.games.lock().unwrap();
        *games = new_games.clone();
        self.invoke_callback();
    }



}
