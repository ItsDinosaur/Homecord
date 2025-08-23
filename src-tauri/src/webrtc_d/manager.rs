use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

use crate::webrtc_d::peer::Peer;

pub struct WebRtcManager {
    // channel_id -> Vec<Peer>
    peers: Mutex<HashMap<String, Vec<Arc<Peer>>>>,
}

impl WebRtcManager {
    pub fn new() -> Self {
        Self {
            peers: Mutex::new(HashMap::new()),
        }
    }

    pub async fn get_peer(&self, channel_id: &str, peer_id: &str) -> Option<Arc<Peer>> {
        let map = self.peers.lock().await;
        map.get(channel_id)
            .and_then(|v| v.iter().find(|p| p.peer_id == peer_id).cloned())
    }

    pub async fn get_or_create_peer(&self, channel_id: String, peer_id: String) -> Arc<Peer> {
        if let Some(p) = self.get_peer(&channel_id, &peer_id).await {
            return p;
        }
        let peer = Arc::new(Peer::new(peer_id.clone(), channel_id.clone()).await);
        let mut map = self.peers.lock().await;
        map.entry(channel_id).or_default().push(peer.clone());
        peer
    }

    pub async fn remove_peer(&self, channel_id: &str, peer_id: &str) {
        let mut map = self.peers.lock().await;
        if let Some(v) = map.get_mut(channel_id) {
            v.retain(|p| p.peer_id != peer_id);
        }
    }
}
