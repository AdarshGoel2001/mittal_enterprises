const fs = require('fs');
const path = require('path');

const sqlFilePath = path.join(__dirname, '../../mittalenterprises-files-DB/DBmittalenter.sql');
const outputFilePath = path.join(__dirname, '../src/data/products.json');

function extractValuesBlocks(content, tableName) {
    const blocks = [];
    const startMarker = `INSERT INTO \`${tableName}\``;
    let startIndex = 0;

    while (true) {
        startIndex = content.indexOf(startMarker, startIndex);
        if (startIndex === -1) break;

        const valuesStartIndex = content.indexOf('VALUES', startIndex);
        if (valuesStartIndex === -1) break;

        // Find the end of the statement (;)
        let inQuote = false;
        let escape = false;
        let endIndex = -1;

        for (let i = valuesStartIndex; i < content.length; i++) {
            const char = content[i];

            if (escape) {
                escape = false;
                continue;
            }

            if (char === '\\') {
                escape = true;
                continue;
            }

            if (char === "'") {
                inQuote = !inQuote;
            }

            if (char === ';' && !inQuote) {
                endIndex = i;
                break;
            }
        }

        if (endIndex !== -1) {
            blocks.push(content.substring(valuesStartIndex + 6, endIndex).trim());
            startIndex = endIndex + 1;
        } else {
            break;
        }
    }

    return blocks;
}

function parseValues(valuesStr) {
    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let inQuote = false;
    let escape = false;
    let inRow = false;

    for (let i = 0; i < valuesStr.length; i++) {
        const char = valuesStr[i];

        if (escape) {
            currentVal += char;
            escape = false;
            continue;
        }

        if (char === '\\') {
            currentVal += char;
            escape = true;
            continue;
        }

        if (char === "'") {
            inQuote = !inQuote;
            continue; // Don't include quotes in the value
        }

        if (!inRow && char === '(' && !inQuote) {
            inRow = true;
            currentRow = [];
            currentVal = '';
            continue;
        }

        if (inRow && char === ')' && !inQuote) {
            inRow = false;
            currentRow.push(processValue(currentVal));
            rows.push(currentRow);
            continue;
        }

        if (inRow && char === ',' && !inQuote) {
            currentRow.push(processValue(currentVal));
            currentVal = '';
            continue;
        }

        if (inRow) {
            currentVal += char;
        }
    }
    return rows;
}

function processValue(val) {
    val = val.trim();
    if (val === 'NULL') return null;
    if (!isNaN(val) && val !== '') return Number(val);
    return val;
}

function main() {
    console.log('Reading SQL file...');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Parsing Categories...');
    const categoryBlocks = extractValuesBlocks(sqlContent, 'categories');
    const categoryRows = categoryBlocks.flatMap(block => parseValues(block));

    // Schema: id, name, position, status, description, metaKeyword, metaDescription, title, image, parent_id, company_id, url
    const categories = categoryRows.map(row => ({
        id: row[0],
        name: row[1],
        description: row[4],
        image: row[8],
        parent_id: row[9],
        url: row[11],
        products: []
    }));

    console.log(`Found ${categories.length} categories.`);

    console.log('Parsing Products...');
    const productBlocks = extractValuesBlocks(sqlContent, 'products');
    const productRows = productBlocks.flatMap(block => parseValues(block));

    // Schema: id, productId, name, small_image, large_image, extra_image, smallDescription, largeDescription, otherDetails, metaKeyword, metaDescription, title, price, leastprice, itemcode, position, status, feature, company_id, url
    const products = productRows.map(row => ({
        id: row[0],
        name: row[2],
        image: row[3],
        description: row[6],
        fullDescription: row[7],
        itemCode: row[14],
        url: row[19]
    }));

    console.log(`Found ${products.length} products.`);

    console.log('Parsing Category-Product Relations...');
    const relationBlocks = extractValuesBlocks(sqlContent, 'categories_products');
    const relationRows = relationBlocks.flatMap(block => parseValues(block));

    // Map products to categories
    const productsMap = new Map(products.map(p => [p.id, p]));
    const categoriesMap = new Map(categories.map(c => [c.id, c]));

    relationRows.forEach(row => {
        const prodId = row[0];
        const catId = row[1];

        const product = productsMap.get(prodId);
        const category = categoriesMap.get(catId);

        if (product && category) {
            if (!category.products.find(p => p.id === product.id)) {
                category.products.push(product);
            }
        }
    });

    // Build Hierarchy
    const rootCategories = [];

    categories.forEach(cat => {
        const parent = categoriesMap.get(cat.parent_id);
        if (parent) {
            if (!parent.subcategories) parent.subcategories = [];
            parent.subcategories.push(cat);
        } else {
            rootCategories.push(cat);
        }
    });

    console.log(`Identified ${rootCategories.length} root categories.`);

    console.log('Writing to JSON...');
    fs.writeFileSync(outputFilePath, JSON.stringify(rootCategories, null, 2));
    console.log('Done!');
}

main();
