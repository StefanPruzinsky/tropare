const puppeteer = require("puppeteer");
const fs = require("fs");
// const { stringify } = require("csv-stringify");

(async () => {
    let = text =
        "Православия светильниче,/ Церкве утверждение и учителю, монахов доброто,/ богословов поборниче непреоборимый, Григорие чудотворче,/ Фессалонитская похвало, проповедниче благодати,// молися выну спастися душам нашим.";

    // Launch browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto("http://slavenica.com/");

    // Interact with the form (replace selectors and input values)
    await page.type("#slovo", text);
    await page.$eval('#text-select', check => check.checked = true);

    // Wait for a few seconds to allow processing
    await page.waitForTimeout(5000);

    // Extract and copy the result (replace selector)
    const result = await page.$eval("#otvet", (el) => {
        // Extract the text content
        const text = el.textContent.trim();

        // Split by the pipe (|) and process each variant
        const variants = text.split('║'); // Skip the first empty element
        const processedVariants = variants.map((variant) => {
            if (variant.includes('│')) {
                // Take the first variant after splitting by the pipe
                return variant.split('│')[0].trim();
            }

            // Remove unnecessary spaces
            return variant.replace(/\s+/g, ' ');
        });

        return processedVariants.join('');
    });

    const filename = "tropare.csv";
    const writableStream = fs.createWriteStream(filename);

    const columns = [
        "date",
        "saint_name",
        "tropar",
        "kondak",
        "hlas",
        "text",
    ];

    writableStream.write(columns.join(',') + '\r\n');
    writableStream.write(result);

    console.log("Translated Result:", result);
    console.log("Text:", text);

    // Close the browser
    await browser.close();
})();
