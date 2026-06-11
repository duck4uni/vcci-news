const VIETNAMESE_D_CHARACTERS = /[đĐ]/g;
const DASH_LIKE_CHARACTERS = /[\u2010-\u2015\u2212]+/g;

function replaceVietnameseDCharacter(character: string) {
  return character === "Đ" ? "D" : "d";
}

export function toCmsSlug(value: string) {
  return value
    .trim()
    .replace(DASH_LIKE_CHARACTERS, "-")
    .replace(VIETNAMESE_D_CHARACTERS, replaceVietnameseDCharacter)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
