<?php

namespace App\Services;

use Google\Cloud\Vision\V1\ImageAnnotatorClient;

class VisionService
{
    protected $client;

    public function __construct()
    {
        $this->client = new ImageAnnotatorClient();
    }

    public function detectText($imagePath)
    {
        $image = file_get_contents($imagePath);
        $response = $this->client->textDetection($image);
        $texts = $response->getTextAnnotations();

        if ($texts) {
            return $texts[0]->getDescription();
        } else {
            return null;
        }
    }
}
