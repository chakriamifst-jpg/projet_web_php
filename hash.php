<?php
$salt = '$2y$12$l8XV3Yyo0sxeblUZzBJp5e';
echo crypt('12345', $salt) . PHP_EOL;
