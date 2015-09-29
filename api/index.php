<?php

require 'vendor/autoload.php';

/**
 * @var \Slim\Slim
 */
$app = new \Slim\Slim(array(
    'debug' => false,
    'log.enabled' => true,
    'log.level' => \Slim\Log::DEBUG
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
        Helpers::sendJson(array(
            'error' => array(
                'error_code' => 'unauthorized',
                'error_msg' => 'Для виконання цієї діх необхідно авторизуватися'
            )
        ));

        return false;
    }

    return true;
}

function checkAdminAuth() {
    if(!checkAuth()) {
        return false;
    }

    global $session, $app;

    if('admin' !== $session->getUserType ())  {
        Helpers::sendJson(array(
            'error' => array(
                'error_code' => 'forbidden',
                'error_msg' => 'Доступ мають лише адміністратори'
            )
        ));

        return false;
    }

    return true;
}

$app->error(function (\Exception $e) use ($app) {

    $log = date('[Y-m-d H:i:s]') . ' PHP error: ' . $e->getMessage() . ' at ' . $e->getFile() . ' line ' .  $e->getLine();

    if(!empty($_SERVER['REQUEST_URI'])) {
        $log .= ', HTTP ' . $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'];
    }

    file_put_contents(__DIR__ . '/logs/error.log', $log . PHP_EOL, FILE_APPEND);

    $app->response->setStatus(200);

    Helpers::sendJson(array(
        'error' => array(
            'error_code' => $e->getCode(),
            'error_msg' => $e->getMessage()
        )
    ));
});

$app->notFound(function() use($app) {
    $app->response->setStatus(200);

    Helpers::sendJson(array(
        'error' => array(
            'error_code' => 404,
            'error_msg' => 'Not Found'
        )
    ));

    $app->stop();
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
        'timeout'   => $session->getTimeout(),
        'is_test_completed' => $session->getUser()->getIsTestCompleted()
    ));

});

$app->get('/logout', function () use ($session) {

    if(!checkAuth ()) {
        return;
    }

    $status = $session->logout();

    Helpers::sendJson(array(
        'status' => $status
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

$app->delete('/result', function() use ($session) {
    if(!checkAuth()) {
        return;
    }

    $status = $session->getUser()->resetTestResult();

    Helpers::sendJson(array(
        'status' => $status
    ));
});

$app->get('/groups', function() use($app) {
    if(!checkAdminAuth()) {
        return;
    }

    $app->etag('groups');
    $app->expires('+15 minutes');

    Helpers::sendJson(AdminHelpers::getGroups());

});


$app->get('/admin/results', function() {
    if(!checkAdminAuth()) {
        return;
    }

    $response = AdminHelpers::getResults();

    Helpers::sendJson($response);
});


$app->get('/admin/result/:studentId', function($studentId) {
    if(!checkAdminAuth()) {
        return;
    }

    $response = User::findByStudentId($studentId)->getTestResult();

    Helpers::sendJson($response);
});

$app->run();