<?php

$database = include __DIR__ . '/database.php';

return array(
    "paths" => array(
        "migrations" => "migrations"
    ),
    "environments" => array(
        "default_migration_table" => "phinxlog",
        "default_database" => "prod",
        "prod" => array(
            "adapter" => $database['database_type'],
            "host" => $database['server'],
            "name" => $database['database_name'],
            "user" => $database['username'],
            "pass" => $database['password'],
            "port" => isset($database['port']) ? $database['port'] : null
        )
    )
);