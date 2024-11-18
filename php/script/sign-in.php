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

// all fields filled out
if(empty($nickname) || empty($password)) {
	echo json_encode(["code" => 16]);
	exit();
}

// validate nickname
$user_model = new UserModel();

$user = $user_model->fetchByNickname($nickname);
if(!$user) {
	echo json_encode(["code" => 17]);
	exit();
}

$_SESSION["temp_nickname"] = $nickname;

// validate password
if(!password_verify($password, $user["password"])) {
	echo json_encode(["code" => 18]);
	exit();
}

$_SESSION["id"] = (int) $user["id"];
$_SESSION["nickname"] = $user["nickname"];
$_SESSION["time"] = time();
unset($_SESSION["temp_nickname"]);

echo json_encode(["code" => 19]);
exit();