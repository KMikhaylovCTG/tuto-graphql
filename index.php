<?php
require_once __DIR__.'/conf/path.php';
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Tutoriel GraphQL - Journée Fusion 003</title>
    <link href="public/css/matrix.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div id="main-app"></div>
<ul>
<?php
require_once CONF_DIR.'install.php';
require_once CONF_DIR.'addType.php';
?>
    <li>
        <form action="index.php" method="POST">
            <input type="text" name="type" placeholder="URL du type (ex: personne)" />
        </form>
    </li>
</ul>
<script type="text/javascript" src="public/js/react/react.js"></script>
<script type="text/javascript" src="public/js/react/react-dom.js"></script>
<script type="text/javascript" src="public/js/relay/relay.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
<script type="text/babel">
    <?php
    $dd = dir(REACT_LIB_DIR);
    $nbFiles = 0;
    while (false !== ($entry = $dd->read())) {
        if (is_file(REACT_LIB_DIR . $entry) and preg_match('/\.js$/', $entry)) {
            echo "// --------------------------------------------------\n";
            echo "// GRAPHQL TUTORIEL\n";
            echo "// " . strtoupper($entry) . "\n";
            echo "// --------------------------------------------------\n";
            echo file_get_contents(REACT_LIB_DIR . $entry) . "\n\n";
            $nbFiles++;
        }
    }
    if ($nbFiles > 0) {
    ?>
    Relay.injectNetworkLayer(
        new Relay.DefaultNetworkLayer('http://localhost:5000/graphql')
    );
    // Pages
    ReactDOM.render(
        React.createElement(Relay.RootContainer,
            {
                Component: Page,
                route: pageRoute
            }),
        document.getElementById('main-app')
    );
    <?php } ?>
</script>
</body>
</html>