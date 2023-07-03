import { customAlphabet } from "nanoid";
import { numbers } from "nanoid-dictionary";
import slugify from "slugify";

const randomNumbers = customAlphabet(numbers, 5);

export const slugStringDB = async (
  value: string,
  _table: string,
  _id?: string | null
) => {
  const slugifiedValue = slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });

  return `${slugifiedValue}-${randomNumbers()}`;
};
