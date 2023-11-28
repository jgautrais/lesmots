<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class DictService {
    public function transformJson() {
        $csvData = Storage::get('dict.csv');
        $lines = explode(PHP_EOL, $csvData);
        $array = array();
        foreach ($lines as $line) {
            $word = str_getcsv($line, "\t")[0];
            if (!str_contains($word, ' ') && strlen($word) > 2 && strlen($word) < 10 && !in_array($word, $array)) {
                $array[] = $word;
            }
        }
        Storage::put('dico.json', json_encode($array));

    }
}
