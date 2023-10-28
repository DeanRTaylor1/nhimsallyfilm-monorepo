export class Strings {
  static capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  static replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  static removeSpecialChars(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  static sanitizeString(str: string) {
    const noDiacritics = Strings.removeSpecialChars(str);
    const noSpecialChars = noDiacritics.replace(/[^a-zA-Z0-9\s]/g, "-");
    const noSpaces = Strings.replaceAll(noSpecialChars, " ", "-");
    const noExtraHyphens = Strings.replaceAll(noSpaces, "--+", "-");
    return noExtraHyphens.toLowerCase();
  }

  static displayFriendlyString(str: string) {
    const withSpaces = str.replace(/-/g, " ");
    const capitalized = withSpaces.replace(/(^|\s)\S/g, (letter) =>
      letter.toUpperCase()
    );
    return capitalized;
  }
}
