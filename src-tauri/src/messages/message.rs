use serde::{Deserialize, Serialize};
use reqwest::Client;
use chrono::NaiveDateTime;

#[derive(Serialize)]
struct Message {
    pub content: String,
    pub channel_id: i32,
    pub user_id: i32,
    pub image_url: String,
    timestamp: NaiveDateTime,
}

pub async fn send_message( message: Message) -> Result<(), String> {
    let client = Client::new();
    let url = "http://homecord.itsdinosaur.com/protected/send_message";

    let response = client
        .post(url)
        .json(&message)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    if response.status().is_success() {
        Ok(())
    } else {
        let error_message = response
            .text()
            .await
            .map_err(|e| format!("Failed to read error message: {}", e))?;
        Err(format!("Failed to send message: {}", error_message))
    }
}