<?php

class KneuApi
{
    protected $url = 'https://auth.kneu.edu.ua/api/%s';

    protected static $instance;

    protected $secret;

    protected $ch;

    protected function __construct () {
        $config = Config::api();
        $this->secret = $config['secret'];
    }

    public static function getInstance() {
        if(!static::$instance) {
            static::$instance = new static;
        }

        return static::$instance;
    }

    public function getAccessToken ($code, $redirect_uri) {

        $answer = $this->request('token', array(
            'code' => $code,
            'redirect_uri' => $redirect_uri
        ));

        var_dump($answer);
    }

    protected function request ($method, array $params = array())
    {
        if(!$this->ch) {
            $this->ch = curl_init();

            curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($this->ch, CURLOPT_HEADER, false);
            curl_setopt($this->ch, CURLOPT_TIMEOUT, 10);

            curl_setopt($this->ch, CURLOPT_POST, true);
        }

        $url = sprintf($this->url, $method);

        curl_setopt($this->ch, CURLOPT_URL, $url);
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, http_build_query($params));

        $response = curl_exec($this->ch);

        if(false === $response) {
            throw new CurlException($this->ch);
        }

        $answer = json_decode($response);

        if( null === $answer) {
            throw new JsonException;
        }

        return $answer;
    }

    public function __desctruct () {
        curl_close($this->ch);
    }
}