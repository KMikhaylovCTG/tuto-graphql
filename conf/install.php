<?php
if (!IS_INSTALLED) {
    if (!function_exists('mkdir_safe')) {
        function mkdir_safe($dirname) {
            if (!is_dir(dirname($dirname))) {
                mkdir(dirname($dirname));
            }
            if (!is_dir($dirname)) {
                mkdir($dirname);
            }
        }
    }
    exec('npm install', $installOutput);
    if (!empty($installOutput)) {
        foreach ($installOutput as $line) {
            echo "<li>{$line}</li>";
        }
    }
    mkdir_safe(REACT_SRC_DIR);
    mkdir_safe(REACT_LIB_DIR);
    mkdir_safe(GRAPHQL_DIR);
    copy(DEFAULT_DIR.'/schema.js', SERVER_DIR.'/schema.js');
    echo '<li>Installation terminée.</li>';
}

