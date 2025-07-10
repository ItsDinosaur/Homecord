/*
use tauri::State;
use sqlx::posrgress::PGPool;

use crate::db::loginHandler;

#[tauri::command]
pub async fn login(
    state: State<'_, PGPool>,
    username: String,
    password: String,
) -> Result<bool, String> {
    match loginHandler::login_handler(&state, username, password).await {
        Ok(exists) => Ok(exists),
        Err(e) => Err(format!("Login failed: {}", e)),
    }
}
*/
use crate::user::encryption::hash;
use serde::{Deserialize, Serialize};
use reqwest::Client;
use keyring::Entry;

#[derive(Serialize)]
struct LoginPayload {
    username: String,
    encrypted_password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginResponse {
    access_token: String,
    refresh_token: String,
}


#[tauri::command]
pub async fn login(username: String, password: String) -> Result<LoginResponse, String> {
    let client = Client::new();
    let url = "http://homecord.itsdinosaur.com/login";
    let encrypted_password = hash(password.as_str()).to_string();

    let payload = LoginPayload {
        username,
        encrypted_password,
    };

    let response = client
        .post(url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if response.status().is_success() {
        eprintln!("Login successful");

        let login_response: LoginResponse = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;
        Ok(login_response)
    } else {
        println!("Login failed with status: {}", response.status());
        let error_message = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        Err(format!("Login failed: {}", error_message))
    }
}

#[tauri::command]
pub async fn store_tokens(accessToken: String, refreshToken: String) -> Result<(), String> {       //keyring storage
    let access_entry = Entry::new("homecord-app", "accessToken")
        .map_err(|e| format!("Failed to create access token entry {}", e))?;
    let refresh_entry = Entry::new("homecord-app", "refreshToken")
        .map_err(|e| format!("Failed to create refresh token entry {}", e))?;

    access_entry.set_password(&accessToken)
        .map_err(|e| format!("Failed to store access token: {}", e))?;
    refresh_entry.set_password(&refreshToken)
        .map_err(|e| format!("Failed to store refresh token: {}", e))?;
    eprintln!("Tokens stored succesfull!");
    Ok(())
}

/* 
#[tauri::command]
pub async fn get_access_token() -> Result<String, String> {
    let entry = Entry::new("homecord", "accessToken")
        .map_err(|e| format!("Failed to create entry: {}", e))?;
    entry.get_password()
        .map_err(|e| format!("Failed to get access token: {}", e))
}
        */
#[tauri::command]
pub async fn get_access_token() -> Result<String, String> {
    eprintln!("Attempting to retrieve access token...");
    let entry = Entry::new("homecord-app", "accessToken")
        .map_err(|e| {
            eprintln!("Failed to create entry: {}", e);
            format!("Failed to create entry: {}", e)
        })?;
    
    match entry.get_password() {
        Ok(token) => {
            eprintln!("Successfully retrieved access token");
            Ok(token)
        },
        Err(e) => {
            eprintln!("Failed to get access token: {}", e);
            Err(format!("Failed to get access token: {}", e))
        }
    }
}

#[tauri::command]
pub async fn get_refresh_token() -> Result<String, String> {
    let entry = Entry::new("homecord-app", "refreshToken")
        .map_err(|e| format!("Failed to create refresh token entry: {}", e))?;
    entry.get_password()
        .map_err(|e| format!("Failed to get refresh token: {}", e))
}