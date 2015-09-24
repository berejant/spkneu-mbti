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

        $appConfigJsonFile = __DIR__ . '/../../config.json';

        if(!file_exists($appConfigJsonFile)) {
            throw new ConfigException('App config.json not found');
        }

        $appConfigJson = file_get_contents($appConfigJsonFile);

        if(!$appConfigJson) {
            throw new ConfigException('Failed to load app config.json');
        }

        $appConfig = json_decode($appConfigJson);

        if(!$appConfig) {
            throw new ConfigException('Failed to parse app config.json');
        }

        if(!isset($appConfig->oauth, $appConfig->oauth->clientId)) {
            throw new ConfigException('In app config.json not found clientId');
        }

        $config['id'] = $appConfig->oauth->clientId;

        return $config;
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
}