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

        // генерируем массива с итоговым балами по шкалам
        $sectionTotals = array();

        foreach($this->sectionGroups as $sectionGroup) {
            $sectionTotals += array_fill_keys($sectionGroup, 0);
        }

        $sectionMaxTotals = $sectionTotals;

        // заполняем итоговые балы по шкалам + максимальное значение
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

            // расчитываем максимальные балы по разным шкалам (секциями)
            foreach($question->answers as $answer) {
                if(isset($answer->section)) {
                    $sectionKey = $answer->section;
                    $sectionMaxTotals[$sectionKey] += $this->getScoreValue($answer->score, $sex);
                }
            }
        }

        // расчитываем по каждой шкале долю балов в зависимости от максимума
        $sectionFractions = array();
        foreach($sectionMaxTotals as $sectionKey => $sectionMaxTotal)
        {
            $sectionFractions[$sectionKey] =  $sectionTotals[$sectionKey] / $sectionMaxTotal;
        }

        // расчитываем коефициент по каждой группе шкал
        $sectionGroupCoefficients = array();
        // расчитываем процент выраженности каждой шкалы в своей группе
        $sectionExpressions = array();
        foreach($this->sectionGroups as $sectionGroupKey => $sectionGroupItems) {
            $sectionGroupCoefficients[$sectionGroupKey] = 0;
            foreach($sectionGroupItems as $sectionKey)
            {
                // расчитываем коефициент по каждой группе шкал
                $sectionGroupCoefficients[$sectionGroupKey] += $sectionFractions[$sectionKey];
            }

            foreach($sectionGroupItems as $sectionKey)
            {
                // расчитываем процент выраженности каждой шкалы в своей группе
                $sectionExpressions[$sectionKey] = $sectionFractions[$sectionKey] / $sectionGroupCoefficients[$sectionGroupKey];
            }
        }

        $sectionGroupDominants = array();
        $sectionGroupIsExpressed = array();

        // расчитываем доминурующую секцию (предпочтение)
        foreach($this->sectionGroups as $sectionGroupKey => $sectionGroupItems) {
            $_maxExpression = null;
            $_minExpression = 1E9;

            foreach($sectionGroupItems as $sectionKey)
            {
                $sectionExpression = $sectionExpressions[$sectionKey];

                if($sectionExpression > $_maxExpression) {
                    $_maxExpression = $sectionExpression;
                    $sectionGroupDominants[$sectionGroupKey] = $sectionKey;
                }

                $_minExpression = min($_minExpression, $sectionExpression);
            }

            // ярко выраженный результат - эсли одна шкала превосходит другую в более чем два раза.
            // Также, в случае если меньшая шкала = 0, то значит большая шкала - ярко выраженна
            $sectionGroupIsExpressed[$sectionGroupKey] =  $_minExpression ? $_maxExpression / $_minExpression > 2 : true;
        }

        $formula = implode('', $sectionGroupDominants);

        return array(
            'groups' => $this->sectionGroups,
            'totals' => $sectionTotals,
            'maxTotals' => $sectionMaxTotals,
            'fraction' => $this->roundArray($sectionFractions, 2, 100),
            'coefficients' => $this->roundArray($sectionGroupCoefficients),
            'expressions' => $this->roundArray($sectionExpressions, 2, 100),
            'dominants' => $sectionGroupDominants,
            'isExpressed' => $sectionGroupIsExpressed,
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

    protected function roundArray($array, $precision = 3, $multiplier = 1) {
        foreach($array as &$value) {
            $value = round($value, $precision) * $multiplier;
        }
        unset($value);

        return $array;
    }

}