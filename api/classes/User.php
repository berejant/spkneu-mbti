<?php

class User
{
    protected $id;

    protected $type;

    protected $studentId;

    protected $adminId;

    protected $sex;

    public function __construct($id, $type) {
        $this->id = $id;
        $this->type = $type;
    }

    /**
     * @return int
     */
    public function getStudentId ()
    {
        if('student' === $this->type && null === $this->studentId) {
            global $db;

            $id = $db->get('mbti_student', 'id', array('user_id' => $this->id));

            $this->studentId = (int)$id;
        }

        return $this->studentId;
    }

    protected $name;

    public function getName() {
        if(null === $this->name) {
            global $db;

            $name = $db->get(
                $this->type === 'admin' ? 'mbti_admin' : 'mbti_student',
                array('first_name', 'last_name'),
                array('user_id' => $this->id)
            );

            $this->name = $name['first_name'] . ' ' . $name['last_name'];
        }

        return $this->name;
    }

    /**
     * @return array
     */
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

        return array();
    }


    /**
     * Сохраняет результат тестирования в БД
     * @param stdClass $answers
     * @return array
     */
    public function saveAnswers (\stdClass $answers) {

        global $db;

        $result = array();

        foreach($answers as $questionId => $answerId) {
            if(!is_numeric($questionId)) {
                continue;
            }

            if(!in_array($answerId, array('a', 'b', 'c'))) {
                continue;
            }

            $where = array(
                'AND' => array(
                    'student_id' => $this->getStudentId(),
                    'question_id' => $questionId
                )
            );

            if($db->has('mbti_answers', $where)) {
                $db->update('mbti_answers', array(
                    'answer' => $answerId
                ), $where);
            } else {
                $db->insert('mbti_answers',  array(
                    'student_id' => $this->getStudentId(),
                    'question_id' => $questionId,
                    'answer' => $answerId
                ));
            }

            list(,$error) = $db->error();

            if(!$error) {
                $result[$questionId] = $answerId;
            }
        }

        return $result;
    }

    public function getSex() {
        if(null === $this->sex) {
            global $db;
            $this->sex = $db->get('mbti_student', 'sex', array('user_id' => $this->id));
        }

        return $this->sex;
    }

    public function getTestResult () {
        global $db;

        $result = TestResult::getInstance()->calculateResult($this->getAnswers(), $this->getSex());

        $db->update('mbti_student', array(
            'person_formula' => $result['formula']
        ), array(
            'user_id' => $this->id
        ));

        $result['name'] = $this->getName();

        return $result;
    }

    public function resetTestResult () {
        global $db;

        $db->update('mbti_student', array(
            'person_formula' => null
        ), array(
            'user_id' => $this->id
        ));

        $db->delete('mbti_answers', array(
            'student_id' => $this->getStudentId()
        ));

        return true;
    }

    public function getIsTestCompleted() {
        global $db;

        return (bool)$db->get('mbti_student', 'person_formula', array('user_id' => $this->id));
    }

}