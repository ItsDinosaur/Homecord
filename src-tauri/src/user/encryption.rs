use sha2;

pub fn hash(password: &str) -> String {
    use sha2::{Sha256, Digest};
    
    // Create a Sha256 hasher
    let mut hasher = Sha256::new();
    
    // Write input password to hasher
    hasher.update(password);
    
    // Read hash digest and convert it to a hexadecimal string
    let result = hasher.finalize();
    format!("{:x}", result)
}