<?php

class Helpers
{
    public static function sendJson($data) {
        $response = \Slim\Slim::getInstance()->response;

        $response->headers->set('Content-Type', 'application/json');
        $response->setBody(json_encode($data));
    }

}