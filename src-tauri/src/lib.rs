// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;
mod user;
use crate::commands::{login, get_access_token, get_refresh_token, store_tokens, fetchChannels};


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![login, greet, get_access_token, get_refresh_token, store_tokens,
            fetchChannels,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
