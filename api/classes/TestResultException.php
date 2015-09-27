<?php

class TestResultException extends \Exception
{
    const NO_ANSWER_ERROR_CODE = 1;

    protected $questionId;

    public function __construct($message, $code = null, $additionalData = null)
    {
        parent::__construct($message, $code);

        if(self::NO_ANSWER_ERROR_CODE === $code) {
            $this->questionId = $additionalData;
        }
    }

    public function getQuestionId () {
        return $this->questionId;
    }

}