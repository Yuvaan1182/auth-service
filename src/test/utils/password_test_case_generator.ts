const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*";

type PasswordOptions = {
  includeUpper: boolean;
  includeLower: boolean;
  includeNumber: boolean;
  includeSymbol: boolean;
};

function randomChar(chars: string) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function randomString(chars: string, length: number) {
  return Array.from({ length }, () => randomChar(chars)).join("");
}

export const generate_password = (options: PasswordOptions): string => {
  let password = "";

  if (options.includeUpper) password += randomChar(upper);
  if (options.includeLower) password += randomChar(lower);
  if (options.includeNumber) password += randomChar(numbers);
  if (options.includeSymbol) password += randomChar(symbols);

  const all = upper + lower + numbers + symbols;
  password += randomString(all, 4);

  return password;
};

export const random_rule_combinations_array = (): Array<PasswordOptions> => {
  const combinations = [];

  for (let i = 0; i < 16; i++) {
    combinations.push({
      includeUpper: Boolean(i & 1),
      includeLower: Boolean(i & 2),
      includeNumber: Boolean(i & 4),
      includeSymbol: Boolean(i & 8),
    });
  }
  return combinations;
};
