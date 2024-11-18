<?php

require __DIR__ . "/../top.php";

$token = $_POST["token"];
$response_id = Token::validate($token);
if($response_id) {
	echo json_encode(["code" => $response_id]);
	exit();
}

$nickname = trim($_POST["nickname"]);
$password = $_POST["password"];
$confirm_password = $_POST["confirm_password"];

// all fields filled out
if(
	empty($nickname) ||
	empty($password) ||
	empty($confirm_password)
) {
	echo json_encode(["code" => 4]);
	exit();
}

// length of nickname
if(strlen($nickname) < CONFIG["nicknameMinLength"]) {
	echo json_encode(["code" => 5]);
	exit();
}

if(strlen($nickname) > CONFIG["nicknameMaxLength"]) {
	echo json_encode(["code" => 6]);
	exit();
}

// validate nickname
if(!preg_match("/^[a-zA-Z0-9]+$/", $nickname)) {
	echo json_encode(["code" => 7]);
	exit();
}

$user_model = new UserModel();

// nickname already in use
if($user_model->existsByNickname($nickname)) {
	echo json_encode(["code" => 8]);
	exit();
}

$_SESSION["temp_nickname"] = $nickname;

// length of password
if(strlen($password) < CONFIG["passwordMinLength"]) {
	echo json_encode(["code" => 9]);
	exit();
}

if(strlen($password) > CONFIG["passwordMaxLength"]) {
	echo json_encode(["code" => 10]);
	exit();
}

// lowercase and uppercase letter
if(
	!preg_match("/[a-z]/", $password) ||
	!preg_match("/[A-Z]/", $password)
) {
	echo json_encode(["code" => 11]);
	exit();
}

// number
if(!preg_match("/[0-9]/", $password)) {
	echo json_encode(["code" => 12]);
	exit();
}

// special character
if(!preg_match("/[^a-zA-Z0-9]/", $password)) {
	echo json_encode(["code" => 13]);
	exit();
}

// passwords match
if($password !== $confirm_password) {
	echo json_encode(["code" => 14]);
	exit();
}

// create account
$connection = new DatabaseConnection();

$id = $connection->getInstance()->lastInsertId();

// general
$password = password_hash($password, PASSWORD_DEFAULT);

$connection->query(
	"INSERT INTO user_general (id, nickname, password)
		VALUES (:id, :nickname, :password)",
	[
		":id" => $id,
		":nickname" => $nickname,
		":password" => $password
	]
);

// profile
$connection->query(
	$connection,
	"INSERT INTO user_profile (id, join_date, gender, birthday, about_me)
		VALUES (:id, :join_date, :gender, :birthday, :about_me)",
	[
		":id" => $id,
		":join_date" => time(),
		":gender" => null,
		":birthday" => null,
		":about_me" => null
	]
);

$_SESSION["id"] = $id;
$_SESSION["time"] = time();
unset($_SESSION["temp_nickname"]);

echo json_encode(["code" => 15]);
exit();