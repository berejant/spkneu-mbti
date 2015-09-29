<?php

class AdminHelpers
{
    public static function getGroups () {
        global $db;

        $groups = $db->select('mbti_group', array('id', 'name'));

        $return = array();

        foreach($groups as $group) {
            $group['id'] = (int)$group['id'];
            $return[$group['id']] = $group;
        }

        return $return;
    }

    public static function getResults (array $filters = array()) {
        global $db;

        $where = array(
            'ORDER' => array(
                'person_formula DESC',
                'last_name ASC',
            )
        );

        if(isset($filters['groupId']) && is_numeric($filters['groupId'])) {
            $where['AND']['group_id'] = (int)$filters['groupId'];
        }

        $results = $db->select('mbti_student', array(
            'id', 'group_id', 'first_name', 'middle_name', 'last_name', 'person_formula'
        ), $where);

        foreach($results as &$item) {
            $item['id'] = (int)$item['id'];
            $item['group_id'] = (int)$item['group_id'];
        }
        unset($item);

        return $results;
    }
}