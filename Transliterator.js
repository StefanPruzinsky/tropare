class Transliterator {
    transliterationMap = {
        // Cyrillic to Slovak transliteration
        'Б': 'B', 'б': 'b',
        'В': 'V', 'в': 'v',
        'Г': 'H', 'г': 'h',
        'Д': 'D', 'д': 'd',
        'Е': 'E', 'е': 'e',
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
        'Я': 'Ja', 'я': 'ja',
        
        // Church Slavonic specific characters
        'Ѣ': 'I', 'ѣ': 'i',
        'Ѳ': 'F', 'ѳ': 'f',
        'Ѵ': 'I', 'ѵ': 'i',
        'І': 'I', 'і': 'i',
        'Ѥ': 'Je', 'ѥ': 'je',
        'Ѧ': 'En', 'ѧ': 'en',
        'Ѫ': 'On', 'ѫ': 'on',
        'Ѩ': 'Jen', 'ѩ': 'jen',
        'Ѭ': 'Jon', 'ѭ': 'jon',
    };
    
    transliterateAzbukaToLatin(text) {
        // Handle specific vowel combinations with "j"
        text = text
            .replace(/ие/g, 'ije').replace(/Ие/g, 'Ije').replace(/ИЕ/g, 'IJE')
            .replace(/ое/g, 'oje').replace(/Ое/g, 'Oje').replace(/ОЕ/g, 'OJE')
            .replace(/уе/g, 'uje').replace(/Уе/g, 'Uje').replace(/УЕ/g, 'UJE')
            .replace(/ые/g, 'yje').replace(/Ые/g, 'Yje').replace(/ЫЕ/g, 'YJE')
            .replace(/ии/g, 'iji').replace(/Ии/g, 'Iji').replace(/ИИ/g, 'IJI');

        // Handle specific combinations where "ь" follows certain consonants
        text = text
            .replace(/Дь/g, 'Ď').replace(/дь/g, 'ď')
            .replace(/Ть/g, 'Ť').replace(/ть/g, 'ť')
            .replace(/Нь/g, 'Ň').replace(/нь/g, 'ň')
            .replace(/Ль/g, 'Ľ').replace(/ль/g, 'ľ');

        // Replace specific letter pairs
        text = text
            .replace(/Ня/g, 'Ňa').replace(/ня/g, 'ňa')
            .replace(/Ля/g, 'Ľa').replace(/ля/g, 'ľa')
            .replace(/Дя/g, 'Ďa').replace(/дя/g, 'ďa')
            .replace(/Тя/g, 'Ťa').replace(/тя/g, 'ťa')
            .replace(/Ню/g, 'Ňu').replace(/ню/g, 'ňu')
            .replace(/Лю/g, 'Ľu').replace(/лю/g, 'ľu')
            .replace(/Дю/g, 'Ďu').replace(/дю/g, 'ďu')
            .replace(/Тю/g, 'Ťu').replace(/тю/g, 'ťu');

        // Replace "Е"/"е" at the beginning of each word
        text = text.replace(/(^|\s|[.,;!?()"'«»])Е/g, '$1Je').replace(/(^|\s|[.,;!?()"'«»])е/g, '$1je');
        
        // Transliterate the rest of the text character by character
        let transliteratedText = text.split('').map((char) => {
            return this.transliterationMap[char] || char;
        }).join('');

        // Remove any extra spaces created by replacements and return the result
        return transliteratedText.replace(/\s+/g, ' ').trim();
    }
}

module.exports = Transliterator;

// Example usage
// const transliterator = new Transliterator();
// const azbukaText = `
// Благослови́, душе́ моя́, Го́спода. Го́споди Бо́же мо́й, воз­вели́чил­ся еси́ зѣло́: во исповѣ́данiе и въ велелѣ́поту обле́кл­ся еси́:
// одѣя́йся свѣ́томъ я́ко ри́зою, простира́яй не́бо я́ко ко́жу:
// покрыва́яй вода́ми превы́спрен­няя Своя́, полага́яй о́блаки на восхожде́нiе Свое́, ходя́й на крилу́ вѣ́треню:
// творя́й а́нгелы Своя́ ду́хи, и слуги́ Своя́ пла́мень о́гнен­ный:
// основа́яй зе́млю на тве́рди ея́: не преклони́т­ся въ вѣ́къ вѣ́ка.
// Бе́здна я́ко ри́за одѣя́нiе ея́, на гора́хъ ста́нутъ во́ды:
// от­ запреще́нiя Тво­его́ побѣ́гнутъ, от­ гла́са гро́ма Тво­его́ убоя́т­ся.
// Восхо́дятъ го́ры, и низхо́дятъ поля́, въ мѣ́сто е́же основа́лъ еси́ и́мъ.
// Предѣ́лъ положи́лъ еси́, его́же не пре́йдутъ, ниже́ обратя́т­ся покры́ти зе́млю.
// Посыла́яй исто́чники въ де́брехъ, посредѣ́ го́ръ про́йдутъ во́ды.
// Напая́ютъ вся́ звѣ́ри се́лныя, жду́тъ {воспрiи́мутъ} она́гри въ жа́жду свою́.
// На ты́хъ пти́цы небе́сныя при­­вита́ютъ: от­ среды́ ка́менiя дадя́тъ гла́съ.
// Напая́яй го́ры от­ превы́спрен­нихъ Сво­и́хъ: от­ плода́ дѣ́лъ Тво­и́хъ насы́тит­ся земля́.
// Прозяба́яй траву́ ското́мъ, и зла́къ на слу́жбу человѣ́комъ, извести́ хлѣ́бъ от­ земли́:
// и вино́ весели́тъ се́рдце человѣ́ка, ума́стити лице́ еле́емъ: и хлѣ́бъ се́рдце человѣ́ка укрѣпи́тъ.
// `;
// const latinText = transliterator.transliterateAzbukaToLatin(azbukaText);
// console.log(latinText);
