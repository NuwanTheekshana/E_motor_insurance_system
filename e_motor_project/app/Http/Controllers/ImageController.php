<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Cloud\Vision\V1\ImageAnnotatorClient;

class ImageController extends Controller
{
    public function extractImagetoText(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = $request->file('image')->getPathName();

        $rawText = $this->detectTextFromImage($imagePath);

        $structuredData = $this->processText($rawText);

        return response()->json($structuredData);
    }


    private function detectTextFromImage($imagePath)
    {
        $imageAnnotator = new ImageAnnotatorClient();

        $image = file_get_contents($imagePath);

        $response = $imageAnnotator->documentTextDetection($image);
        $annotation = $response->getFullTextAnnotation();

        $imageAnnotator->close();

        return $annotation ? $annotation->getText() : '';
    }

    private function processText($rawText)
{
    $cleanedText = preg_replace('/\\\u[0-9a-fA-F]{4}/', '', $rawText); 
    $lines = explode("\n", $cleanedText); 

    $data = [];

    
    for ($i = 0; $i < count($lines); $i++) {
        $line = trim($lines[$i]); 

        
        if (preg_match('/Registration No\./i', $line)) {
            $data['registration_number'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        if (preg_match('/Chassis No\./i', $line)) {
            $data['chassis_number'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        if (preg_match('/Owner\/Address/i', $line)) {
            $data['owner_name'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        if (preg_match('/Class of Vehicle/i', $line)) {
            $data['vehicle_class'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        if (preg_match('/Make/i', $line)) {
            $data['make'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        if (preg_match('/Model/i', $line)) {
            $data['model'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        if (preg_match('/Year of Manufacture/i', $line)) {
            $data['year_of_manufacture'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        if (preg_match('/Colour/i', $line)) {
            $data['color'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        if (preg_match('/Fuel Type/i', $line)) {
            $data['fuel_type'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        if (preg_match('/Engine No\./i', $line)) {
            $data['engine_number'] = isset($lines[$i + 1]) ? trim($lines[$i + 1]) : null;
        }
        
    }

    
    return array_merge([
        'registration_number' => null,
        'chassis_number' => null,
        'owner_name' => null,
        'vehicle_class' => null,
        'make' => null,
        'model' => null,
        'year_of_manufacture' => null,
        'color' => null,
        'fuel_type' => null,
        'engine_number' => null,
    ], $data);
}


    private function extractValue($line, $key)
    {
        return trim(str_replace($key, '', $line));
    }
}
