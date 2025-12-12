const config = {
    startDate: '2025-12-13',
    totalDays: 8
};

const START_DATE = new Date(config.startDate);

function testDate(mockNowStr) {
    const now = new Date(mockNowStr);
    const diffTime = Math.abs(now - START_DATE);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = Math.min(diffDays + 1, config.totalDays);

    console.log(`Now: ${mockNowStr}, Start: ${config.startDate}`);
    console.log(`Diff (ms): ${now - START_DATE}`);
    console.log(`Abs Diff (ms): ${diffTime}`);
    console.log(`Diff Days: ${diffDays}`);
    console.log(`Current Day: ${currentDay}`);
    console.log('---');
}

testDate('2025-12-11'); // 2 days before
testDate('2025-12-13'); // On start date
testDate('2025-12-14'); // 1 day after
