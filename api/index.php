<?php

require 'vendor/autoload.php';

/**
 * @var \Slim\Slim
 */
$app = new \Slim\Slim(array(
    'debug' => true
));

/**
 * @var medoo
 */
$db = new medoo(Config::database());

/**
 * @var Session
 */
$session = new Session;

function checkAuth () {
    global $session, $app;

    if(!$session->getUserId())  {
        $app->response->setStatus(401);
        Helpers::sendJson(array(
            'error' => array(
                'error_code' => 'Unauthorized',
                'error_msg' => 'Для виконання цієї діх необхідно авторизуватися'
            )
        ));

        return false;
    }

    return true;
}

$app->error(function (\Exception $e) use ($app) {
    Helpers::sendJson(array(
        'error' => array(
            'error_code' => $e->getCode(),
            'error_msg' => $e->getMessage()
        )
    ));
});

$app->notFound(function() use($app) {
    Helpers::sendJson(array(
        'error' => array(
            'error_code' => 404,
            'error_msg' => 'Not Found'
        )
    ));
});


$app->get('/login', function () use ($app, $db, $session) {
    $code = $app->request->get('code');
    $redirect_uri = $app->request->get('redirect_uri');

    $client = Config::oauth();

    $api = new Kneu\Api;
    $token = $api->oauthToken($client['id'], $client['secret'], $code, $redirect_uri);

    $session->init($token, $api);

    Helpers::sendJson(array(
        'token'     => $session->getKey(),
        'user_type' => $session->getUserType(),
        'timeout'   => $session->getTimeout()
    ));

});


$app->get('/answers', function() use ($session) {

    if(!checkAuth ()) {
        return;
    }

    Helpers::sendJson($session->getUser()->getAnswers());
});


$app->post('/answers', function() use ($session) {
    if(!checkAuth ()) {
        return;
    }

    $answers = Helpers::getRequestJson();

    $response = $session->getUser()->saveAnswers($answers);

    Helpers::sendJson($response);
});


$app->get('/result', function() use ($session) {
    if(!checkAuth ()) {
        return;
    }

    $response = $session->getUser()->getTestResult();

    Helpers::sendJson($response);
});

$app->run();