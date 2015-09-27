<?php
/**
 * Расчет итогов тестирования
 */

class TestResult
{
    /**
     * @var array Групировка секции
     */

    protected $sectionGroups = array(
        'EI',
        'SN',
        'TF',
        'JP'
    );


    /**
     * @var self
     */
    protected static $instance;

    /**
     * @return self
     */
    public static function getInstance() {
        if(!static::$instance) {
            static::$instance = new static;
        }

        return static::$instance;
    }


    /**
     * @var \stdClass
     */
    protected $questions;
    protected function __construct() {
        $this->questions = Config::questions();

        $sectionGroups = array();
        foreach($this->sectionGroups as $sectionGroup) {
            $sectionGroups[$sectionGroup] = str_split($sectionGroup);
        }

        $this->sectionGroups = $sectionGroups;
    }

    /**
     * @param array $selectedAnswerIds
     * @param string $sex
     * @throws TestResultException
     */
    public function calculateResult($selectedAnswerIds, $sex = 'male')
    {
        $sex = $sex === 'female' ? 'female' : 'male';

        $sectionTotals = array();

        foreach($this->sectionGroups as $sectionGroup) {
            $sectionTotals += array_fill_keys($sectionGroup, 0);
        }

        $sectionMaxTotals = $sectionTotals;

        foreach($this->questions as $questionId => $question)
        {
            if(!isset($selectedAnswerIds[$questionId])) {
                $message = 'Не вказана відповідь на запитання #' . $questionId;
                throw new TestResultException($message, TestResultException::NO_ANSWER_ERROR_CODE, $questionId);
            }

            $selectedAnswerId = $selectedAnswerIds[$questionId];

            if(!isset($question->answers->$selectedAnswerId)) {
                $message = 'У запитанні #' . $questionId . ' немає варіанту відповіді #' . $selectedAnswerId;
                throw new TestResultException($message, TestResultException::NO_ANSWER_ERROR_CODE, $questionId);
            }

            $selectedAnswer = $question->answers->$selectedAnswerId;

            if(isset($selectedAnswer->section)) {
                $sectionKey = $selectedAnswer->section;
                $sectionTotals[$sectionKey] += $this->getScoreValue($selectedAnswer->score, $sex);
            }

            // расчитываем аксимаьные балы по разным шкалам (секциями)
            foreach($question->answers as $answer) {
                if(isset($answer->section)) {
                    $sectionKey = $answer->section;
                    $sectionMaxTotals[$sectionKey] += $this->getScoreValue($answer->score, $sex);
                }
            }
        }

        $sectionGroupDominants = array();
        foreach($this->sectionGroups as $sectionGroupKey => $sectionGroupItems) {
            $_maxTotal = null;

            foreach($sectionGroupItems as $sectionKey)
            {
                if($sectionTotals[$sectionKey] > $_maxTotal) {
                    $_maxTotal = $sectionTotals[$sectionKey];
                    $sectionGroupDominants[$sectionGroupKey] = $sectionKey;
                }
            }
        }

        $formula = implode('', $sectionGroupDominants);

        return array(
            'groups' => $this->sectionGroups,
            'totals' => $sectionTotals,
            'maxTotals' => $sectionMaxTotals,
            'dominants' => $sectionGroupDominants,
            'formula'   => $formula
        );
    }

    protected function getScoreValue($score, $sex) {
        if (is_object($score)) {
            // распределение на основе пола (м/ж)
            if (!isset($score->$sex)) {
                throw new TestResultException('Некорректно установлены баллы за вопрос #' . $questionId);
            }

            return $score->$sex;
        }

        return $score;
    }

}