-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    user_id BINARY(16) PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2. BINS
CREATE TABLE IF NOT EXISTS bins (
    bin_id BINARY(16) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    capacity_percent INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active'
);


-- 3. WASTE EVENTS
CREATE TABLE IF NOT EXISTS waste_events (
    event_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16),
    bin_id BINARY(16) NOT NULL,
    waste_type VARCHAR(50) NOT NULL,
    weight_kg DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (bin_id) REFERENCES bins(bin_id)
);


-- 4. POINTS LEDGER
CREATE TABLE IF NOT EXISTS points_ledger (
    ledger_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    event_id BINARY(16),
    points_delta INT NOT NULL,
    reason VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES waste_events(event_id)
);


-- 5. REWARDS
CREATE TABLE IF NOT EXISTS rewards (
    reward_id BINARY(16) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    points_cost INT NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
);


-- 6. REDEMPTIONS
CREATE TABLE IF NOT EXISTS redemptions (
    redemption_id BINARY(16) PRIMARY KEY,
    user_id BINARY(16) NOT NULL,
    reward_id BINARY(16) NOT NULL,
    points_spent INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (reward_id) REFERENCES rewards(reward_id)
);
