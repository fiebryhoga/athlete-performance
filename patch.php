<?php
$content = file_get_contents('bootstrap/app.php');
$content = str_replace(
    '->withExceptions(function (Exceptions $exceptions) {',
    "->withExceptions(function (Exceptions \$exceptions) {\n        \$exceptions->reportable(function (\\Throwable \$e) {\n            \\Illuminate\\Support\\Facades\\Log::error('Exception caught: ' . \$e->getMessage() . ' Status: ' . (\$e instanceof \\Symfony\\Component\\HttpKernel\\Exception\\HttpExceptionInterface ? \$e->getStatusCode() : 'none'));\n        });",
    $content
);
file_put_contents('bootstrap/app.php', $content);
