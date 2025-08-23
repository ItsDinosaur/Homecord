// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod user;
mod webrtc_d;
mod commands;
fn main() {
    homecord_lib::run()
}
