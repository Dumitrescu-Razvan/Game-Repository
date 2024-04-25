use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Game{
    pub id: i32,
    pub title: String,
    pub year: i32,
    pub rating: f32,
}