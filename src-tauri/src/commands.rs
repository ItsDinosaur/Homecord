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

use serde::{Deserialize, Serialize};
use reqwest::Client;

#[derive(Serialize)]
struct LoginPayload {
    username: String,
    password: String,
}

#[derive(Deserialize, Debug)]
struct LoginResponse {
    token: String,
}

#[tauri::command]
pub async fn login(username: String, password: String) -> Result<String, String> {
    let client = Client::new();
    let url = "http://homecord.itsdinosaur.com/login";

    let payload = LoginPayload {
        username,
        password,
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
        Ok(login_response.token)
    } else {
        eprintln("Login failed with status: {}", response.status());
        let error_message = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        Err(format!("Login failed: {}", error_message))
    }
}