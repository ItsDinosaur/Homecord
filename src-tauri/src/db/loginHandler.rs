/*
use sql::posrgress::PGPool;

pub async fn login_handler(
    pool: &PGPool,
    username: String,
    password: String,
) -> Result<bool, sql::Error> {
    let query = "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1 AND password = $2)";
    let row = sqlx::query(query)
        .bind(&username)
        .bind(&password)
        .fetch_one(pool)
        .await?;

    let exists: bool = row.get(0);
    Ok(exists)
}
    */
