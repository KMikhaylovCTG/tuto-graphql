<?php

define(ROOT_DIR, dirname(__DIR__).'/');
define('REACT_DIR', ROOT_DIR.'src/');
define('SERVER_DIR', ROOT_DIR.'server/');
define('GRAPHQL_DIR', SERVER_DIR.'types/');
define(CONF_DIR, ROOT_DIR.'conf/');
define(DEFAULT_DIR, CONF_DIR.'default/');
define('IS_INSTALLED', is_dir(REACT_DIR));