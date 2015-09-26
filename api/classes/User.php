<?php

class User
{
    protected $id;

    protected $type;

    protected $studentId;

    protected $adminId;

    public function __construct($id, $type) {
        $this->id = $id;
        $this->type = $type;
    }

    public function getStudentId ()
    {
        if('student' === $this->type && null === $this->studentId) {
            global $db;

            $id = $db->get('mbti_student', 'id', array('user_id' => $this->id));

            $this->studentId = (int)$id;
        }

        return $this->studentId;
    }

    public function getAnswers () {
        if($this->getStudentId ()) {
            global $db;

            $rows = $db->select('mbti_answers', array(
                'question_id',
                'answer'
            ), array(
                'student_id' => $this->getStudentId()
            ));

            $return = array();
            foreach ($rows as $row) {
                $return[$row['question_id']] = $row['answer'];
            }

            return $return;
        }
    }

}