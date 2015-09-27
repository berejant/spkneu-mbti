<?php

class Session
{
    /**
     * @var self
     */
    protected static $instance;

    /**
     * @var string
     */
    protected $key;

    /**
     * @var integer
     */
    protected $userId;

    /**
     * @var string enum (student|admin)
     */
    protected $userType;

    /**
     * @var User
     */
    protected $user;

    /**
     *
     */
    public function __construct() {
        ini_set('session.save_path', __DIR__ . '/../sessions/');
        ini_set('session.gc_maxlifetime', 7200);
        ini_set('session.use_only_cookies', true);
        ini_set('session.use_cookies', false);

        $auth = filter_input(INPUT_SERVER, 'HTTP_AUTHORIZATION');

        if($auth && preg_match('#^Bearer\s+(.+)$#', $auth, $match)) {
            $this->setKey($match[1]);
        }
    }

    /**
     * @param stdClass $accessToken
     * @param \Kneu\Api $api
     * @return self
     */
    public function init (\stdClass $accessToken, \Kneu\Api $api) {
        global $db;

        $isRegistered = false;

        if($db->has('mbti_student', array('user_id' => $accessToken->user_id))) {
            $isRegistered = true;
            $type = 'student';

        } elseif($db->has('mbti_admin', array('user_id' => $accessToken->user_id))) {
            $isRegistered = true;
            $type = 'admin';
        }

        if(!$isRegistered) {
            $type = $this->createUser($api);
        }

        session_start();
        $_SESSION['user_type'] = $type;
        $_SESSION['user_id'] = (int)$accessToken->user_id;

        $this->loadDataFromNativeSession();

        return $this;
    }

    protected function createUser (\Kneu\Api $api) {
        global $db;

        $user = $api->getUser();

        if($user->type !== 'student') {
            throw new Exception('Доступ дозволено лише студентам', 403);
        }

        if(!$db->has('mbti_group', array('id'=> $user->group_id))) {
            $group = $api->getGroup($user->group_id);

            $db->insert('mbti_group', array(
                'id'   => $group->id,
                'name' => $group->name,
            ));
        }

        $db->insert('mbti_student', array(
            'user_id'      => $user->id,
            'group_id'     => $user->group_id,
            'sex'          => $user->sex,
            'first_name'   => $user->first_name,
            'middle_name'  => $user->middle_name,
            'last_name'    => $user->last_name,
        ));

        return 'student';
    }

    public function logout ()
    {
        session_id($this->key);
        session_start();
        session_destroy();
        $this->key = null;
        $this->userId = null;
        $this->userType = null;

        return true;
    }

    /**
     * @return string
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @param string $key
     * @return self
     */
    public function setKey($key)
    {
        if($key) {
            session_id($key);
            session_start();

            $this->loadDataFromNativeSession();
        } else {
            $this->key = null;
        }

        return $this;
    }

    protected function loadDataFromNativeSession () {
        if(!empty($_SESSION['user_id'])) {
            $this->key = session_id();
            $this->userId = $_SESSION['user_id'];
            $this->userType = $_SESSION['user_type'];

            session_write_close();
        } else {
            session_destroy();
        }
    }

    public function getUserId () {
        return $this->userId;
    }

    public function getUserType () {
        return $this->userType;
    }

    public function getTimeout() {
        return (int)ini_get('session.gc_maxlifetime');
    }

    public function getUser() {
        if(!$this->user) {
            $this->user = new User($this->getUserId(), $this->getUserType());
        }

        return $this->user;
    }
}
