<?php

$typeUrl = filter_input(INPUT_POST, 'type');
$typeName = ucfirst($typeUrl);
if ($typeName != null) {

    ob_start();
    include DEFAULT_DIR.'type.php';
    $typeFile = ob_get_contents();
    ob_end_clean();
    file_put_contents(GRAPHQL_DIR.$typeName.'.js', $typeFile);
    echo "<li>{$typeName}.js créé</li>";
}