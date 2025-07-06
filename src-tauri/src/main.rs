// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
/*mod db;*/

/*use sqlx::{pool, postgres::PgPool};*/

/*#[tokio::main]*/
fn main() {
    /* 
    let pool = PgPool::connect("postgres://user:password@localhost/dbname")
        .await
        .expect("Failed to connect to the database");
    */
    homecord_lib::run()
}
