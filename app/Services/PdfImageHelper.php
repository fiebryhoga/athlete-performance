<?php

namespace App\Services;

class PdfImageHelper
{
    /**
     * Cache processed base64 strings during request lifecycle to avoid reprocessing identical images.
     */
    protected static array $cache = [];

    /**
     * Resolve and optimize an image to a lightweight Base64 string for PDF rendering.
     *
     * @param string|null $imagePath Relative or absolute path
     * @param int $maxWidth Max thumbnail width (default: 200px)
     * @param int $maxHeight Max thumbnail height (default: 200px)
     * @param int $quality JPEG quality (default: 75)
     * @return string|null Data URI or null
     */
    public static function getOptimizedBase64(?string $imagePath, int $maxWidth = 200, int $maxHeight = 200, int $quality = 75): ?string
    {
        if (empty($imagePath)) {
            return null;
        }

        // Cache key
        $cacheKey = md5($imagePath . "_{$maxWidth}_{$maxHeight}_{$quality}");
        if (isset(static::$cache[$cacheKey])) {
            return static::$cache[$cacheKey];
        }

        // Resolve absolute path on disk
        $fullPath = static::resolveImagePath($imagePath);
        if (!$fullPath || !file_exists($fullPath) || !is_readable($fullPath)) {
            return null;
        }

        // If GD is not available, fallback to simple base64
        if (!extension_loaded('gd')) {
            $type = pathinfo($fullPath, PATHINFO_EXTENSION) ?: 'jpeg';
            $data = file_get_contents($fullPath);
            $base64 = 'data:image/' . strtolower($type) . ';base64,' . base64_encode($data);
            static::$cache[$cacheKey] = $base64;
            return $base64;
        }

        $info = @getimagesize($fullPath);
        if (!$info) {
            return null;
        }

        list($origW, $origH, $imageType) = $info;

        // If already smaller than max dimensions and file size is small (< 100KB), return direct base64
        if ($origW <= $maxWidth && $origH <= $maxHeight && filesize($fullPath) <= 102400) {
            $type = image_type_to_extension($imageType, false) ?: 'jpeg';
            $data = file_get_contents($fullPath);
            $base64 = 'data:image/' . strtolower($type) . ';base64,' . base64_encode($data);
            static::$cache[$cacheKey] = $base64;
            return $base64;
        }

        // Load image resource based on type
        $src = null;
        switch ($imageType) {
            case IMAGETYPE_JPEG:
                $src = @imagecreatefromjpeg($fullPath);
                break;
            case IMAGETYPE_PNG:
                $src = @imagecreatefrompng($fullPath);
                break;
            case IMAGETYPE_WEBP:
                if (function_exists('imagecreatefromwebp')) {
                    $src = @imagecreatefromwebp($fullPath);
                }
                break;
            case IMAGETYPE_GIF:
                $src = @imagecreatefromgif($fullPath);
                break;
        }

        if (!$src) {
            // Fallback to raw base64 if GD cannot parse
            $type = image_type_to_extension($imageType, false) ?: 'jpeg';
            $data = file_get_contents($fullPath);
            $base64 = 'data:image/' . strtolower($type) . ';base64,' . base64_encode($data);
            static::$cache[$cacheKey] = $base64;
            return $base64;
        }

        // Calculate aspect ratio
        $ratio = min($maxWidth / $origW, $maxHeight / $origH);
        $newW = max(1, (int) round($origW * $ratio));
        $newH = max(1, (int) round($origH * $ratio));

        $dst = imagecreatetruecolor($newW, $newH);

        // Fill background white for JPEG export
        $white = imagecolorallocate($dst, 255, 255, 255);
        imagefilledrectangle($dst, 0, 0, $newW, $newH, $white);

        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

        ob_start();
        imagejpeg($dst, null, $quality);
        $thumbData = ob_get_clean();

        imagedestroy($src);
        imagedestroy($dst);

        $base64 = 'data:image/jpeg;base64,' . base64_encode($thumbData);
        static::$cache[$cacheKey] = $base64;

        return $base64;
    }

    /**
     * Resolve filesystem path from various storage / url representations.
     */
    public static function resolveImagePath(string $img): ?string
    {
        if (file_exists($img)) {
            return $img;
        }

        $clean = str_replace('storage/', '', ltrim($img, '/'));
        
        $candidates = [
            public_path('storage/' . $clean),
            storage_path('app/public/' . $clean),
            public_path(ltrim($img, '/')),
            storage_path('app/' . $clean),
        ];

        foreach ($candidates as $candidate) {
            if (file_exists($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * Helper to process exercise images for a collection of trainings or a single training.
     */
    public static function processTrainingImages($trainings, int $maxWidth = 200, int $maxHeight = 200, int $quality = 75): void
    {
        $collection = is_iterable($trainings) ? $trainings : [$trainings];

        foreach ($collection as $training) {
            if (!isset($training->blocks)) {
                continue;
            }

            foreach ($training->blocks as $block) {
                if (!isset($block->items)) {
                    continue;
                }

                foreach ($block->items as $item) {
                    if ($item->exercise) {
                        $base64Images = [];
                        if (!empty($item->exercise->images) && is_array($item->exercise->images)) {
                            foreach ($item->exercise->images as $img) {
                                $optimized = static::getOptimizedBase64($img, $maxWidth, $maxHeight, $quality);
                                if ($optimized) {
                                    $base64Images[] = $optimized;
                                }
                            }
                        }
                        $item->exercise->setAttribute('base64_images', $base64Images);
                    }
                }
            }
        }
    }
}
