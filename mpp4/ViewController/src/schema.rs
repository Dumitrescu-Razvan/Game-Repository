// @generated automatically by Diesel CLI.

diesel::table! {
    companies (id) {
        id -> Int4,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        location -> Varchar,
    }
}

diesel::table! {
    games (id) {
        id -> Int4,
        #[max_length = 255]
        name -> Varchar,
        release_year -> Int4,
        rating -> Int4,
        company_id -> Int4,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        #[max_length = 255]
        username -> Varchar,
        #[max_length = 256]
        password -> Varchar,
        #[max_length = 255]
        email -> Varchar,
    }
}

diesel::joinable!(games -> companies (company_id));

diesel::allow_tables_to_appear_in_same_query!(
    companies,
    games,
    users,
);
