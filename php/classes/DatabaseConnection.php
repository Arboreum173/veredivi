<?php

require __DIR__ . "/../top.php";

class DatabaseConnection {
	private $connection;
	
	public function __construct() {
		// init connection
		// note: should not use root here in an actual project for security reasons
		// also put this in a separate secure and unaccessible file
		$this->connection = new \PDO(
			"mysql:host=127.0.0.1;dbname=veredivi",
			"root",
			"JCRSjAkRKedSsfoY"
		);
		$this->connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		
		// init database
		$cmd = $this->connection->prepare(
			"CREATE DATABASE IF NOT EXISTS veredivi CHARACTER SET utf8mb4 
				COLLATE utf8mb4_unicode_520_ci"
		);
		$cmd->execute();
		
		// init tables
		$cmd = $this->connection->prepare(
			"CREATE TABLE IF NOT EXISTS user_general (
				id INT UNSIGNED PRIMARY KEY,
				nickname VARCHAR(25) NOT NULL,
				password VARCHAR(50) NOT NULL,
				user_level TINYINT UNSIGNED NOT NULL
			)"
		);
		$cmd->execute();
	}
	
	// these might not be necessary
	public function query(string $sql, array $vals = []): \PDOStatement {
		$stmt = $this->connection->prepare($sql);
		$stmt->execute($vals);
		
		return $stmt;
	}
	
	public function fetch(string $sql, array $vals = []): array {
		$stmt = $this->query($sql, $vals);
		$stmt->setFetchMode(\PDO::FETCH_ASSOC);
		
		return $stmt->fetchAll();
	}
	
	public function getInstance(): \PDO {
		return $this->connection;
	}
}