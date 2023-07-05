console.log('Running scraping script...')

function parseTitle(title) {
  return title.substring(0, 15);
}

function parseTags(title) {
  const tags = title.split(' ');
  return tags.filter((tag) => tag.startsWith('#'));
}

function parseReach(reach) {
  return parseInt(reach.split('\n')[0])
}

function scrape() {
  const table = document.getElementsByTagName("table")[0];

  const rows = table.querySelectorAll('tr');
  const rawTableData = [];

  for (const row of rows) {
    const rowData = []
    for (const cell of row.querySelectorAll('td')) {
      rowData.push(cell.innerText.trim())
    }
    // skip header which will be empty
    if (rowData.length > 0) {
      rawTableData.push(rowData)
    }
  }

  // index this out nicely
  const tableData = rawTableData.map((row) => ({
    title: parseTitle(row[1]),
    timestamp: row[2],
    reach: parseReach(row[3]),
    tags: parseTags(row[1]),
  }))
  console.log(tableData);
}

function run() {
  // if (typeof $ === 'undefined') {
  //   alert("JQuery has not been loaded, please reload the page")
  //   return
  // }
  // console.log('jQuery version:', jQuery.fn.jquery);
  scrape()
}


run();