
#[cfg(test)]
mod tests {
    use super::rocket;
    use rocket::local::blocking::Client;
    use rocket::http::Status;

    #[test]
    fn test_index() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.get("/").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.into_string(), Some("Hello, world!".into()));
    }

    #[test]
    fn test_get_all() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.get("/games").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.into_string(), Some(r#"[{"id":0,"title":"The Legend of Zelda: Ocarina of Time","year":1998,"rating":99.0},{"id":1,"title":"Super Mario 64","year":1996,"rating":94.0},{"id":2,"title":"GoldenEye 007","year":1997,"rating":96.0},{"id":3,"title":"Perfect Dark","year":2000,"rating":97.0},{"id":4,"title":"The Legend of Zelda: Majora's Mask","year":2000,"rating":95.0}]"#.into()));
    }

    #[test]
    fn test_get_by_id() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.get("/games/0").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.into_string(), Some(r#"{"id":0,"title":"The Legend of Zelda: Ocarina of Time","year":1998,"rating":99.0}"#.into()));
    }

    #[test]
    fn test_create() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.post("/games").body(r#"{"id":0,"title":"The Legend of Zelda: Breath of the Wild","year":2017,"rating":97.0}"#).header(rocket::http::ContentType::JSON).dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.into_string(), Some(r#"{"id":5,"title":"The Legend of Zelda: Breath of the Wild","year":2017,"rating":97.0}"#.into()));
    }

    #[test]
    fn test_update() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.put("/games/0").body(r#"{"id":0,"title":"The Legend of Zelda: Ocarina of Time","year":1998,"rating":99.0}"#).header(rocket::http::ContentType::JSON).dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.into_string(), Some(r#"{"id":0,"title":"The Legend of Zelda: Ocarina of Time","year":1998,"rating":99.0}"#.into()));
    }

    #[test]
    fn test_delete() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.delete("/games/0").dispatch();
        assert_eq!(response.status(), Status::Ok);
        assert_eq!(response.into_string(), Some(r#"{"id":0,"title":"The Legend of Zelda: Ocarina of Time","year":1998,"rating":99.0}"#.into()));
    }

    #[test]
    fn test_get_by_id_not_found() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.get("/games/100").dispatch();
        assert_eq!(response.status(), Status::NotFound);
    }

    #[test]
    fn test_update_not_found() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.put("/games/100").body(r#"{"id":1,"title":"The Legend of Zelda: Ocarina of Time","year":1998,"rating":100.0}"#).header(rocket::http::ContentType::JSON).dispatch();
        assert_eq!(response.status(), Status::NotFound);
    }

    #[test]
    fn test_delete_not_found() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.delete("/games/100").dispatch();
        assert_eq!(response.status(), Status::NotFound);
    }

    #[test]
    fn test_create_invalid() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.post("/games").body(r#"{"title":"The Legend of Zelda: Breath of the Wild","year":2017}"#).header(rocket::http::ContentType::JSON).dispatch();
        assert_eq!(response.status(), Status::UnprocessableEntity);
    }

    #[test]
    fn test_update_invalid() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.put("/games/0").body(r#"{"title":"The Legend of Zelda: Ocarina of Time","year":1998}"#).header(rocket::http::ContentType::JSON).dispatch();
        assert_eq!(response.status(), Status::UnprocessableEntity);
    }

    #[test]
    fn test_create_invalid_rating() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.post("/games").body(r#"{"title":"The Legend of Zelda: Breath of the Wild","year":2017,"rating":101.0}"#).header(rocket::http::ContentType::JSON).dispatch();
        assert_eq!(response.status(), Status::UnprocessableEntity);
    }

    #[test]
    fn test_update_invalid_rating() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.put("/games/0").body(r#"{"title":"The Legend of Zelda: Ocarina of Time","year":1998,"rating":101.0}"#).header(rocket::http::ContentType::JSON).dispatch();
        assert_eq!(response.status(), Status::UnprocessableEntity);
    }


}