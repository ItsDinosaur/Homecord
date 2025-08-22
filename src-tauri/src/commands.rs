use crate::user::encryption::hash;
use serde::{Deserialize, Serialize};
use reqwest::Client;
use keyring::Entry;
use chrono::Utc;
use chrono::DateTime;

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


#[derive(Serialize, Deserialize, Debug)]
pub struct Channel {
    channel_id: String,
    room_id: String,
    channel_name: String,
    description: Option<String>,
    channel_type: String,
    position: i32,
}
#[tauri::command]
pub async fn fetchChannels(room_id: String) -> Result<Vec<Channel>, String> {
    let client = Client::new();
    let access_token = get_access_token()
        .await
        .unwrap_or_else(|e| {
            eprintln!("Error retrieving access token: {}", e);
            String::new()
        });

    let url = "http://homecord.itsdinosaur.com/protected/channels/";
    let payload = serde_json::json!({
            "room_id": room_id,
        });

    let response = client
        .post(url)
        .bearer_auth(access_token)
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    
    if response.status().is_success() {
        eprintln!("Channels fetched successfully");
        let channels: Vec<Channel> = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;
        Ok(channels)
    } else {
        eprintln!("Failed to fetch channels with status: {}", response.status());
        let error_message = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        Err(format!("Failed to fetch channels: {}", error_message))
    }
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct Message {
    id: String,
    channel_id: String,
    user_id: String,
    content: String,
    timestamp: DateTime<Utc>,
    edited: bool,
    parent_message_id: Option<String>,
    attachment_url: Option<String>,
    attachment_type: Option<String>,
    is_pinned: bool,
    duration_seconds: Option<i32>,
    username: String,
}

#[tauri::command]
pub async fn fetchMessages(channel_id: String) -> Result<Vec<Message>, String> {
    let client = Client::new();
    let access_token = get_access_token()
        .await
        .unwrap_or_else(|e| {
            eprintln!("Error retrieving access token: {}", e);
            String::new()
        });
    let url = "http://homecord.itsdinosaur.com/protected/messages/";
    let payload = serde_json::json!({
        "channel_id": channel_id,
    });
    let response = client
        .post(url)
        .bearer_auth(access_token)
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    if response.status().is_success() {
        eprintln!("Messages fetched successfully for channel {}", channel_id);
        let messages: Vec<Message> = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;
        Ok(messages)
    } else {
        eprintln!("Failed to fetch messages for channel {} with status: {}", channel_id, response
        .status());
        let error_message = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        Err(format!("Failed to fetch messages: {}", error_message))
    }
}

#[tauri::command]
async fn start_call(channel_id: String) -> Result<(), String> {
    // Implementation for starting a call
    Ok(())
}

#[tauri::command]
async fn stop_call(channel_id: String) -> Result<(), String> {
    // Implementation for stopping a call
    Ok(())
}

#[tauri::command]
async fn send_webrtc_signal(signal: String) -> Result<(), String> {
    // Implementation for sending a WebRTC signal
    Ok(())
}