<?php

use Phinx\Migration\AbstractMigration;

class Init extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * http://docs.phinx.org/en/latest/migrations.html#the-abstractmigration-class
     *
     * The following commands can be used in this method and Phinx will
     * automatically reverse them when rolling back:
     *
     *    createTable
     *    renameTable
     *    addColumn
     *    renameColumn
     *    addIndex
     *    addForeignKey
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function up()
    {
        $this->execute(
            'CREATE TABLE `mbti_admin` (
              `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
              `user_id` int(11) unsigned NOT NULL,
              `first_name` tinytext NOT NULL,
              `last_name` tinytext NOT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
        );

        $this->execute(
            'CREATE TABLE `mbti_group` (
              `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
              `name` tinytext NOT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT="Академические группы";'
        );

        $this->execute(
            'CREATE TABLE `mbti_student` (
              `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
              `user_id` int(11) unsigned NOT NULL,
              `group_id` int(11) unsigned NOT NULL,
              `sex` enum("male","female") NOT NULL DEFAULT "male",
              `first_name` tinytext NOT NULL,
              `middle_name` tinytext NOT NULL,
              `last_name` tinytext,
              `person_formula` char(4) DEFAULT NULL,
              PRIMARY KEY (`id`),
              UNIQUE KEY `user_id_index` (`user_id`),
              KEY `group_id` (`group_id`),
              CONSTRAINT `mbti_student_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `mbti_group` (`id`) ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
        );

        $this->execute(
            'CREATE TABLE `mbti_answers` (
              `student_id` int(11) unsigned NOT NULL,
              `question_id` int(10) unsigned NOT NULL,
              `answer` enum("a","b","c") NOT NULL,
              PRIMARY KEY (`student_id`,`question_id`),
              CONSTRAINT `mbti_answers_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `mbti_student` (`id`) ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
        );
    }

    public function down() {
        $this->execute('DROP TABLE IF EXISTS `mbti_admin`;');
        $this->execute('DROP TABLE IF EXISTS `mbti_answers`;');
        $this->execute('DROP TABLE IF EXISTS `mbti_student`;');
        $this->execute('DROP TABLE IF EXISTS `mbti_group`;');
    }
}
