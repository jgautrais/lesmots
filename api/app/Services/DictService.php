<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class DictService {
    public function transformJson() {
        $csvData = Storage::get('dict.csv');
        $lines = explode(PHP_EOL, $csvData);
        $array = array();
        $words = array();
        foreach ($lines as $line) {
            $extract = str_getcsv($line, "\t");
            $word = $extract[0];
            $def = $extract[9];
            if (!str_contains($word, ' ') && mb_strlen($word) > 2 && mb_strlen($word) < 10 && !in_array($word, $words)) {
                $array[] = ['m' => $word, 'd' => $def];
            }
        }
        Storage::put('def.json', json_encode($array));
    }

    public function getWords() {
        $selection = $this->generateWords();
        while($selection === false) {
            $selection = $this->generateWords();
        }

        $final = [
            3 => [],
            4 => [],
            5 => [],
            6 => [],
            7 => [],
            8 => [],
            9 => [],
        ];

        foreach ($selection['match'] as $word) {
            $final[mb_strlen($word)][] = $word;
        }
        var_dump($selection['letters']);
        return $final;
    }

    private function generateWords(): array|bool {
        $letters = range('a', 'z');
        $specialChars = ['à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'ï', 'î', 'ô', 'ö', 'ü', 'ù', 'û'];

        $nbSpecialChar = rand(0, 2);

        $randomLetters = [];
        for($i = 0 ; $i < 9 - $nbSpecialChar ; $i++) {
            $randomLetters[] = $letters[rand(0, count($letters) - (1 + $nbSpecialChar))];
        }

        if ($nbSpecialChar) {
            for($i = 0 ; $i < $nbSpecialChar ; $i++) {
                $randomLetters[] = $specialChars[rand(0, count($specialChars) - 1)];
            }
        }


        $json = Storage::get('dico.json');
        $words = json_decode($json);
        $match = [];
        foreach ($words as $word) {
            if ($this->isValid($word, $randomLetters)) {
                $match[] = $word;
            }
        }

        $check = array_map(function ($letter) use ($match) {
            foreach ($match as $wo) {
                if (in_array($letter, mb_str_split($wo))) {
                    return true;
                }
            }
            return false;
        }, $randomLetters);

        foreach ($check as $ch) {
            if (!$ch) {
                return false;
            }
        }

        $isNine = false;
        foreach ($match as $wor) {
            if (mb_strlen($wor) === 9) {
                $isNine = true;
            }
        }

        if (!$isNine) {
            return false;
        }

        return ['match' => $match, 'letters' => $randomLetters];
    }

    private function isValid($word, $selection): bool {
        if (mb_strlen($word) < 3) {
            return false;
        }
        foreach (mb_str_split($word) as $letter) {
            if (!in_array($letter, $selection)) {
                return false;
            }
        }
        return true;
    }

}
