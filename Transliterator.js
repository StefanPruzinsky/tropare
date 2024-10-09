export class Transliterator {
    transliterationMap = {
        // Cyrillic to Slovak transliteration
        'А': 'A', 'а': 'a',
        'Б': 'B', 'б': 'b',
        'В': 'V', 'в': 'v',
        'Г': 'G', 'г': 'g',
        'Д': 'D', 'д': 'd',
        'Е': 'E', 'е': 'e',
        'Ё': 'Jo', 'ё': 'jo',
        'Ж': 'Ž', 'ж': 'ž',
        'З': 'Z', 'з': 'z',
        'И': 'I', 'и': 'i',
        'Й': 'J', 'й': 'j',
        'К': 'K', 'к': 'k',
        'Л': 'L', 'л': 'l',
        'М': 'M', 'м': 'm',
        'Н': 'N', 'н': 'n',
        'О': 'O', 'о': 'o',
        'П': 'P', 'п': 'p',
        'Р': 'R', 'р': 'r',
        'С': 'S', 'с': 's',
        'Т': 'T', 'т': 't',
        'У': 'U', 'у': 'u',
        'Ф': 'F', 'ф': 'f',
        'Х': 'Ch', 'х': 'ch',
        'Ц': 'C', 'ц': 'c',
        'Ч': 'Č', 'ч': 'č',
        'Ш': 'Š', 'ш': 'š',
        'Щ': 'Šč', 'щ': 'šč',
        'Ъ': '', 'ъ': '',
        'Ы': 'Y', 'ы': 'y',
        'Ь': '', 'ь': '',
        'Э': 'E', 'э': 'e',
        'Ю': 'Ju', 'ю': 'ju',
        'Я': 'Ja', 'я': 'ja'
    };
    
    transliterateAzbukaToLatin(text) {
        return text.split('').map(function (char) {
            return this.transliterationMap[char] || char;
        }).join('');
    }
}