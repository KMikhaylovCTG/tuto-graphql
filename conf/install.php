<?php
if (!IS_INSTALLED) {
    exec('npm install', $installOutput);
    if (!empty($installOutput)) {
        foreach ($installOutput as $line) {
            echo "<li>{$line}</li>";
        }
    }
    mkdir(REACT_SRC_DIR);
    mkdir(REACT_LIB_DIR);
    mkdir(GRAPHQL_DIR);
    copy(DEFAULT_DIR.'/schema.js', SERVER_DIR.'/schema.js');
    echo '<li>Installation terminée.</li>';
}