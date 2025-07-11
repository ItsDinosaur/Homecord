

#[derive(Serialize, Deserialize, Debug)]
pub struct Channel {
    channel_id: String,
    room_id: String,
    name: String,
    description: String,
    r#type: String,
    position: i32,
}

#[tauri::command]
pub async fn fetchChannels() -> Result<Vec<Channel>, String> {
    let client = Client::new();
    let access_token = get_access_token();
    let encoded_token = encodeURIComponent(access_token);

    let url = "http://homecord.itsdinosaur.com/protected/channels/?access_token=${encoded_token}";
    let response = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    if response.status().is_success() {
        let channels: Vec<Channel> = response
            .json()
            .await
            .map_err(|e| format!("Failed to parse response: {}", e))?;
        Ok(channels)
    } else {
        let error_message = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        Err(format!("Failed to fetch channels: {}", error_message))
    }
}