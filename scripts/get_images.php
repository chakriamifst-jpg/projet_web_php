<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$controller = new \App\Http\Controllers\StudentImageController();
$response = $controller->listStudentImages();

if ($response instanceof Illuminate\Http\JsonResponse) {
    echo $response->getContent() . PHP_EOL;
} else {
    print_r($response);
}
