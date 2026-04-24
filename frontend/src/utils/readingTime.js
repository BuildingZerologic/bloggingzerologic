// function getReadingTime(contentBlocks = []) {
//   const wordsPerMinute = 200;
//   let words = 0;

//   contentBlocks.forEach((block) => {
//     block.children?.forEach((c) => {
//       if (c.text) {
//         words += c.text.trim().split(/\s+/).length;
//       }
//     });
//   });

//   const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
//   return `${minutes} Min Read`;
// }