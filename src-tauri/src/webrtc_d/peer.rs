use std::sync::{Arc};
use std::sync::atomic::{AtomicBool, Ordering};
use tokio::sync::{Mutex as AsyncMutex};

use webrtc::api::{APIBuilder, API};
use webrtc::api::media_engine::MediaEngine;
use webrtc::api::interceptor_registry::register_default_interceptors;
use webrtc::interceptor::registry::Registry;
use webrtc::ice_transport::ice_server::RTCIceServer;
use webrtc::peer_connection::RTCPeerConnection;
use webrtc::peer_connection::configuration::RTCConfiguration;
use webrtc::peer_connection::peer_connection_state::RTCPeerConnectionState;
use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;
use webrtc::ice_transport::ice_candidate::RTCIceCandidateInit;
use futures::future;

pub struct Peer {
    pub peer_id: String,
    pub channel_id: String,
    pub pc: Arc<RTCPeerConnection>,
    remote_set: AtomicBool,
    pending_ice: AsyncMutex<Vec<RTCIceCandidateInit>>,
}

impl Peer {
    pub async fn new(peer_id: String, channel_id: String) -> Self {
        // Media + codecs
        let mut m = MediaEngine::default();
        m.register_default_codecs().expect("register codecs");

        let mut registry = Registry::new();
        let registry = register_default_interceptors(registry, &mut m).expect("register interceptors");

        let api: API = APIBuilder::new()
            .with_media_engine(m)
            .with_interceptor_registry(registry)
            .build();

        // Basic ICE; update to your TURN later
        let cfg = RTCConfiguration {
            ice_servers: vec![RTCIceServer {
                urls: vec!["stun:stun.l.google.com:19302".into()],
                ..Default::default()
            }],
            ..Default::default()
        };

        let pc = Arc::new(api.new_peer_connection(cfg).await.expect("new_pc"));

        // Log state changes (also emit events from manager later)
        {
            let pc_clone = pc.clone();
            pc.on_peer_connection_state_change(Box::new(move |s: RTCPeerConnectionState| {
                println!("PeerConnection State: {s}");
                if s == RTCPeerConnectionState::Failed {
                    let _ = pc_clone.close();
                }
                Box::pin(async {})
            }));
        }

        Self {
            peer_id,
            channel_id,
            pc,
            remote_set: AtomicBool::new(false),
            pending_ice: AsyncMutex::new(Vec::new()),
        }
    }

    /// Create local offer, set it, send to signaling server, receive answer, set it
    pub async fn start_and_negotiate<F>(
        &self,
        post_offer: F,
    ) -> Result<(), String>
    where
        F: Fn(String) -> futures::future::BoxFuture<'static, Result<String, String>> + Send + Sync + 'static,
    {
        let offer = self.pc.create_offer(None).await.map_err(|e| e.to_string())?;
        self.pc.set_local_description(offer.clone()).await.map_err(|e| e.to_string())?;

        // send offer.sdp to signaling, expect answer.sdp back
        let answer_sdp = post_offer(offer.sdp).await?;
        let answer = RTCSessionDescription::answer(answer_sdp).map_err(|e| e.to_string())?;

        self.pc.set_remote_description(answer).await.map_err(|e| e.to_string())?;
        self.remote_set.store(true, Ordering::SeqCst);

        // flush pending ICE (if any were queued early)
        let mut pend = self.pending_ice.lock().await;
        for cand in pend.drain(..) {
            self.pc.add_ice_candidate(cand).await.map_err(|e| e.to_string())?;
        }
        Ok(())
    }

    pub async fn add_ice_candidate(
        &self,
        candidate: String,
        sdp_mid: Option<String>,
        sdp_mline_index: Option<u16>,
    ) -> Result<(), String> {
        let init = RTCIceCandidateInit {
            candidate,
            sdp_mid,
            sdp_mline_index: sdp_mline_index.map(|v| v as u16),
            username_fragment: None,
        };

        if self.remote_set.load(Ordering::SeqCst) {
            self.pc.add_ice_candidate(init).await.map_err(|e| e.to_string())
        } else {
            let mut pend = self.pending_ice.lock().await;
            pend.push(init);
            Ok(())
        }
    }
}
