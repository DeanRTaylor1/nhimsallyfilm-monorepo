const getRelativeDate = (date: Date) => {
  const now = new Date();

  const prevSunday = new Date(now.getTime() - now.getDay() * 86400000);

  const prevPrevSunday = new Date(prevSunday.getTime() - 7 * 86400000);
  // console.log(date, prevSunday)

  let relativeWeek;
  if (date >= prevSunday) {
    relativeWeek = "this week";
  } else if (date >= prevPrevSunday) {
    relativeWeek = "last week";
  } else if (date >= new Date(now.getTime() - 21 * 86400000)) {
    relativeWeek = "three weeks ago";
  } else if (date >= new Date(now.getTime() - 28 * 86400000)) {
    relativeWeek = "four weeks ago";
  } else {
    relativeWeek = "more than four weeks ago";
  }
  return relativeWeek;
};

export { getRelativeDate };
