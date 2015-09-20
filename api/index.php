<?php

require 'vendor/autoload.php';

$db = new medoo(Config::database());

$app = new \Slim\Slim([
    'debug' => false
]);

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


$app->get('/getAccessToken', function () use ($app, $db) {
    $code = $app->request->get('code');
    $redirect_uri = $app->request->get('redirect_uri');

    $user = KneuApi::getInstance()->getAccessToken($code, $redirect_uri);

});

$app->run();