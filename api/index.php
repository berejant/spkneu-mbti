<?php

require 'vendor/autoload.php';

$app = new \Slim\Slim([
    'debug' => false
]);

$app->db = new medoo(Config::database());

$app->error(function (\Exception $e) use ($app) {
    Helpers::sendJson([
        'error' => [
            'error_code' => $e->getCode(),
            'error_msg' => $e->getMessage()
        ]
    ]);
});

$app->notFound(function() use($app) {
    Helpers::sendJson([
        'error' => [
            'error_code' => 404,
            'error_msg' => 'Not Found'
        ]
    ]);
});


$app->get('/getAccessToken', function () use ($app) {
    $code = $app->request->get('code');
    $redirect_uri = $app->request->get('redirect_uri');

    $client = Config::oauth();

    $api = new Kneu\Api;
    $token = $api->oauthToken($client['id'], $client['secret'], $code, $redirect_uri);

    var_dump($token);

    $user = $api->getUser();
    var_dump($user);
});

$app->run();