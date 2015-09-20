<?php

class Config
{
    public static function database () {
        return self::loadFile(__FUNCTION__);
    }

    public static function api() {
        return self::loadFile(__FUNCTION__);
    }

    protected static function loadFile ($fileName) {

        $filePath = __DIR__ . '/../config/' . $fileName . '.php';

        if(!file_exists($filePath)) {
            throw new ConfigException('No file' . $fileName);
        }

        $config = include $filePath;

        if(!$config) {
            throw new Exception('Bad config file ' . $fileName);
        }

        return $config;
    }
}