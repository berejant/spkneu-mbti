<?php

class Config
{
    /**
     * @return array
     * @throws ConfigException
     */
    public static function database () {
        return self::loadFile(__FUNCTION__);
    }

    /**
     * @return array
     * @throws ConfigException
     */
    public static function oauth() {
        $config = self::loadFile(__FUNCTION__);

        $appConfig = self::loadFrontEndFile('app');

        if(!isset($appConfig->oauth, $appConfig->oauth->clientId)) {
            throw new ConfigException('In app app.json not found clientId');
        }

        $config['id'] = $appConfig->oauth->clientId;

        return $config;
    }

    public static function questions() {
        return self::loadFrontEndFile('questions');
    }

    /**
     * @param string $fileName
     * @return array
     * @throws ConfigException
     */
    protected static function loadFile ($fileName) {

        $filePath = __DIR__ . '/../config/' . $fileName . '.php';

        if(!file_exists($filePath)) {
            throw new ConfigException('No file' . $fileName);
        }

        $config = include $filePath;

        if(!$config) {
            throw new ConfigException('Bad config file ' . $fileName);
        }

        return $config;
    }

    /**
     * @param string $fileName
     * @return array
     * @throws ConfigException
     */
    protected static function loadFrontEndFile($fileName) {
        $filePath = __DIR__ . '/../../config/' . $fileName . '.json';

        if(!file_exists($filePath)) {
            throw new ConfigException('No file' . $fileName);
        }

        $content = file_get_contents($filePath);

        if(!$content) {
            throw new ConfigException('Empty file ' . $fileName);
        }

        $config = json_decode($content);

        if(null === $config) {
            throw new ConfigException('Bad json in questions.json');
        }

        return $config;
    }
}