<?php
// Simulate image upload by directly calling StudentImageController::uploadImage
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Bootstrap the application (console kernel) so Eloquent/DB are available
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use App\Models\User;

// create a tiny JPEG (1x1 pixel) base64
$jpeg = base64_decode(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhISEhIWFRUVFRUVFRUVFRUVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGy0lICUvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKABJAMBIgACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABQYBBAcDAgj/xABAEAACAQIDBAYGBQMDBQAAAAAAAQIDEQQSIQUTMUEiUWFxgZGhFDJCscHR8BQjQlKSwuHxFjRicoOy/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAJxEBAAICAQQCAgMAAAAAAAAAAAECABEhAxIxBBNBURQiYYGh8P/aAAwDAQACEQMRAD8A9xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//2Q=='
);

$tmpDir = __DIR__ . '/../storage/app/public/temp_test_uploads';
if (!is_dir($tmpDir)) mkdir($tmpDir, 0755, true);
$imagePath = $tmpDir . '/test_upload_' . time() . '.jpg';
file_put_contents($imagePath, $jpeg);

// find or create a test student
/** @var \App\Models\User $student */
$student = User::where('role', 'etudiant')->first();
if (!$student) {
    $student = User::create([
        'name' => 'Test Student',
        'email' => 'test.student+' . time() . '@example.test',
        'password' => bcrypt('password'),
        'role' => 'etudiant'
    ]);
    echo "Created test student with id={$student->id}\n";
} else {
    echo "Using existing student id={$student->id}\n";
}

// create UploadedFile instance
// Use a short original filename to satisfy the 20-char filename rule (without extension)
$uploaded = new UploadedFile($imagePath, 'img.jpg', 'image/jpeg', null, true);

// create a Request and bind to container
$request = Request::create('/', 'POST', [], [], ['image' => $uploaded]);
$app->instance('request', $request);

// call controller
$controller = new \App\Http\Controllers\StudentImageController();
$response = $controller->uploadImage($student->id);

// print the response
if ($response instanceof Illuminate\Http\JsonResponse) {
    echo "Response JSON: \n";
    echo $response->getContent() . "\n";
} else {
    // might be a plain response
    echo "Response: \n" . print_r($response, true) . "\n";
}

// show updated user from DB (model refresh and direct DB query)
$student->refresh();
echo "After refresh - User image_path: " . ($student->image_path ?? 'NULL') . "\n";
echo "After refresh - image_uploaded_at: " . ($student->image_uploaded_at ?? 'NULL') . "\n";

$dbUser = Illuminate\Support\Facades\DB::table('users')->where('id', $student->id)->first();

echo "Direct DB row: \n" . print_r($dbUser, true) . "\n";

// clean up temp image (keep stored uploaded file)
@unlink($imagePath);

exit(0);
