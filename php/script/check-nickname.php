<?php

require __DIR__ . "/../top.php";

$nickname = trim($_POST["nickname"]);


$user_model = new UserModel();
$result = $user_model->existsByNickname($nickname);

echo json_encode(["result" => $result]);
exit();