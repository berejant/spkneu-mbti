<?php

class Helpers
{
    public static function getRequestJson () {
        $request = \Slim\Slim::getInstance()->request();

        return json_decode($request->getBody());
    }

    /**
     * @param mixed $data
     */public static function sendJson($data) {
        $response = \Slim\Slim::getInstance()->response;

        $response->headers->set('Content-Type', 'application/json');
        $response->setBody(json_encode($data));
    }

}