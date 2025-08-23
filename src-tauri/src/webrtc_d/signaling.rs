use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::webrtc_d::manager::WebRtcManager;

#[derive(Debug, Deserialize, Serialize)]
pub struct OfferRequest {
    pub sdp: String,
    pub peer_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnswerResponse {
    pub sdp: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct IceCandidateRequest {
    pub peer_id: String,
    pub candidate: String,
    pub sdp_mid: Option<String>,
    pub sdp_mline_index: Option<u16>,
}

/// Helper that posts offer to your **remote** signaling endpoint and returns answer.sdp
pub async fn post_offer_to_server(
    base_url: &str,
    channel_id: &str,
    peer_id: &str,
    sdp: String,
    token: Option<String>,
) -> Result<String, String> {
    let url = format!("{base_url}/webrtc/{channel_id}/{peer_id}");
    let client = reqwest::Client::new();
    let mut req = client.post(&url).json(&OfferRequest { sdp, peer_id: peer_id.to_string() });
    if let Some(t) = token {
        req = req.bearer_auth(t);
    }
    let resp = req.send().await.map_err(|e| e.to_string())?;
    if !resp.status().is_success() {
        return Err(format!("offer failed: {}", resp.status()));
    }
    let ans: AnswerResponse = resp.json().await.map_err(|e| e.to_string())?;
    Ok(ans.sdp)
}

/// Helper that posts ICE to server (if you also relay ICE via REST)
pub async fn post_ice_to_server(
    base_url: &str,
    channel_id: &str,
    peer_id: &str,
    cand: IceCandidateRequest,
    token: Option<String>,
) -> Result<(), String> {
    let url = format!("{base_url}/webrtc/{channel_id}/{peer_id}/ice");
    let client = reqwest::Client::new();
    let mut req = client.post(&url).json(&cand);
    if let Some(t) = token {
        req = req.bearer_auth(t);
    }
    let resp = req.send().await.map_err(|e| e.to_string())?;
    if !resp.status().is_success() {
        return Err(format!("ice failed: {}", resp.status()));
    }
    Ok(())
}
