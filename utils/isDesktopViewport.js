// function - like the methods
// create an arrow function that takes in page as argument
// create a size variable that ascertains the viewportsize
// return true or false if width is more than 600
export const isDesktopViewport = (page) => {
  const size = page.viewportSize();
  return size.width >= 600;
  // return true or false
};
