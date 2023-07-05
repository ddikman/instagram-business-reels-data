console.log('Running scraping script...')

function parseTitle(title) {
  return title.substring(0, 15);
}

function parseTags(title) {
  const tags = title.split(/\s+/);
  return tags.filter((tag) => tag.startsWith('#'));
}

function parseReach(reachStr) {
  const reach = reachStr.split('\n')[0];
  if (reach.endsWith('K')) {
    return Number(parseFloat(reach.substring(0, reach.length - 1)) * 1000)
  }
  return parseInt(reach)
}

function getUniqueTags(tableData) {
  const tags = tableData.reduce((acc, row) => {
    return acc.concat(row.tags)
  }, [])
  return [...new Set(tags)].sort()
}

function reformatDateTime(str) {
  // I need to fix this later
  return str
}

function formatTable(tableData, uniqueTags) {
  const separator = '\t'
  const headers = ['Title', 'Timestamp', 'Reach', ...uniqueTags].join(separator) + '\n';
  const rows = tableData.map((row) => {
    const rowTags = uniqueTags.map((tag) => {
      return row.tags.includes(tag) ? 'x' : ''
    })
    return [`"${row.title}"`, row.timestamp, row.reach, ...rowTags].join(separator)
  }).join('\n')
  return headers + rows
}

function copy(str, mimeType) {
  document.oncopy = function(event) {
    event.clipboardData.setData(mimeType, str);
    event.preventDefault();
  };
  document.execCommand("copy", false, null);
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
    timestamp: reformatDateTime(row[2]),
    reach: parseReach(row[3]),
    tags: parseTags(row[1]),
  }))

  const uniqueTags = getUniqueTags(tableData);

  const tableFormatted = formatTable(tableData, uniqueTags);
  copy(tableFormatted, 'text/plain');
  alert("Copied data to clipboard!")
}

scrape();