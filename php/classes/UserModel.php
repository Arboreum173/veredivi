<?php

require __DIR__ . "/../top.php";

class UserModel {
	private $connection;
	
	public function __construct() {
		$this->connection = new DatabaseConnection();
	}
	
	public function fetchById(int $id, string $table = "general"): ?array {
		$this->validateId($id);
		
		$data = $this->connection->fetch(
			"SELECT * FROM user_" . $table . " WHERE id = :id",
			[":id" => $id]
		);
		
		if(!$data) return null;
		return $data[0];
	}
	
	public function fetchByNickname(string $nickname,
		string $table = "general"
	): ?array {
		$data = $this->connection->fetch(
			"SELECT * FROM user_general WHERE nickname = :nickname",
			[":nickname" => $nickname]
		);
		
		if(!$data) return null;
		return $data[0];
	}
	
	public function existsById(int $id): bool {
		return (bool) $this->fetchById($id);
	}
	
	public function existsByNickname(string $name): bool {
		return (bool) $this->fetchByNickname($name);
	}
	
	/*
		public static function is_admin_by_id($id) {
			return (bool) self::fetch_by_id($id);
		}
		
		public static function is_admin_by_nickname($nickname) {
			return (bool) self::fetch_by_nickname($nickname);
		}
	*/
}