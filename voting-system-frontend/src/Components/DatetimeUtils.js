function convertTimestampToLocalDateTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}

function timestampBeforeNow(timestamp) {
    const now = Date.now() /1000 | 0;
    return timestamp < now;
}

export {convertTimestampToLocalDateTime, timestampBeforeNow};