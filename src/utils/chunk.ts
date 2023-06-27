const chunkArray = (array: string[], chunk_size: number = 10): string[][] =>
  Array<string>(Math.ceil(array.length / chunk_size))
    .fill("")
    .map((_, index) => index * chunk_size)
    .map((begin) => array.slice(begin, begin + chunk_size));

export default chunkArray;
