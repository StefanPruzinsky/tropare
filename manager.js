const puppeteer = require("puppeteer");
const fs = require("fs");

const Transliterator = require('./Transliterator');

class TroparDownloadingManager {
    #writableStream;
    #transliterator;

    constructor(filename) {
        this.#writableStream = fs.createWriteStream(filename);
        this.#transliterator = new Transliterator();
    }

    async run(months, year) {
        this.writeCsvHeader();

        // Use for...of loop instead of forEach to handle async/await properly
        for (const month of months) {
            const numberOfDays = this.#getDaysInMonth(month, year);

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            for (let day = 1; day <= numberOfDays; day++) {
                let date = new Date(year, month, day);

                let dateInJulian = new Date(date); // Clone the original date
                dateInJulian.setDate(date.getDate() + 13);
                
                await page.goto(`https://azbyka.ru/days/${dateInJulian.toLocaleDateString('en-CA')}`); // YYYY-MM-DD

                let result = await this.downloadRawTropars(page);

                // Process the result by converting to Old Russian via Slavenica
                for (const item of result) {
                    let convertedBlockTitle = await this.convertToOldRussian(item.blockTitle);
                    let convertedTropar = await this.convertToOldRussian(item.troparText);
                    let convertedKondak = await this.convertToOldRussian(item.kondakText);

                    // Update the result with converted texts
                    item.blockTitle = this.#transliterator.transliterateAzbukaToLatin(convertedBlockTitle);
                    item.troparText = this.#transliterator.transliterateAzbukaToLatin(convertedTropar);
                    item.kondakText = this.#transliterator.transliterateAzbukaToLatin(convertedKondak);
                }

                this.writeToCsv(date, result);
            }

            await browser.close();return;
        }
    }

    async downloadRawTropars(page) {
        return await page.evaluate(() => {
            // Helper function to get the first non-empty paragraph
            const getFirstNonEmptyParagraph = (parentElement) => {
                const paragraphs = parentElement?.querySelectorAll('p') || [];
                for (let p of paragraphs) {
                    if (p.innerText.trim()) {
                        return p.innerText.trim(); // Return the first non-empty paragraph
                    }
                }
                return ''; // Return empty if no non-empty paragraphs found
            };

            // Helper function to find an element by its text content
            const findElementByText = (parentElement, tagName, searchText) => {
                const elements = parentElement?.querySelectorAll(tagName) || [];
                for (let el of elements) {
                    if (el.textContent.includes(searchText)) {
                        return el; // Return the first element containing the searchText
                    }
                }
                return null;
            };

            const troparyItems = document.querySelectorAll('.tropary-item');
            let data = [];

            troparyItems.forEach((item) => {
                let blockTitle = item.querySelector('.block_title')?.innerText || '';

                // Find first Tropar element by checking its text content
                let troparElement = findElementByText(item, 'h3', 'Тропарь');
                let troparHlas = troparElement?.querySelector('.glass')?.innerText || '';
                let troparText = getFirstNonEmptyParagraph(troparElement?.closest('.taks_content'));

                // Find first Kondak element by checking its text content
                let kondakElement = findElementByText(item, 'h3', 'Кондак');
                let kondakHlas = kondakElement?.querySelector('.glass')?.innerText || '';
                let kondakText = getFirstNonEmptyParagraph(kondakElement?.closest('.taks_content'));

                // Only store the first Tropar and first Kondak
                if ((troparElement && troparText != '') || (kondakElement && kondakText != '')) {
                    data.push({
                        blockTitle: blockTitle,
                        troparHlas: troparHlas,
                        troparText: troparText,
                        kondakHlas: kondakHlas,
                        kondakText: kondakText
                    });
                }
            });

            return data;  // Return the collected data
        });
    }

    async convertToOldRussian(text) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("http://slavenica.com/");

        await page.type("#slovo", text);
        await page.$eval('#text-select', check => check.checked = true);

        // Wait for the processing
        await page.waitForTimeout(3000);

        // Extract and copy the result
        const result = await page.$eval("#otvet", (el) => {
            const text = el.textContent.trim();
            const variants = text.split('║');
            const processedVariants = variants.map((variant) => {
                if (variant.includes('│')) {
                    return variant.split('│')[0].trim();
                }
                return variant.replace(/\s+/g, ' ');
            });

            return processedVariants.join('');
        });

        await browser.close();

        // remove свѣтъ from the end
        return result.slice(0, -('свѣтъ').length);
    }

    writeToCsv(date, data) {
        const rows = data.map(item => {
            return `"${date.toLocaleDateString('en-CA')}","${item.blockTitle}","${item.troparHlas}","${item.troparText}","${item.kondakHlas}","${item.kondakText}"`;
        }).join('\n');

        this.#writableStream.write(rows + '\n');
    }

    writeCsvHeader() {
        const columns = [
            "date",
            "saint_name",
            "tropar_hlas",
            "tropar_text",
            "kondak_hlas",
            "kondak_text",
        ];

        this.#writableStream.write(columns.join(',') + '\r\n');
    }

    #getDaysInMonth(month, year) {
        // Month is zero-indexed (0 = January, 11 = December)
        return new Date(year, month + 1, 0).getDate();
    }
}

const manager = new TroparDownloadingManager("troparsAndCondacs-MayFinalJulian2.csv");
(async () => {
    await manager.run([4], 2025); // 8 is September
})();

