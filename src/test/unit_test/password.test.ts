import { isStrongPassword } from "#utils/password.util.js";
import { expect, test } from "vitest";
import {
  generate_password,
  random_rule_combinations_array,
} from "../utils/password_test_case_generator.js";

test("valid passwords should pass", () => {
  const rules = random_rule_combinations_array();
  for (const rule of rules) {
    const password = generate_password(rule);
    const character_set = new Set(password);
    const entropy = Math.log2(character_set.size * password.length);

    const shouldBeValid =
      rule.includeUpper &&
      rule.includeLower &&
      rule.includeNumber &&
      rule.includeSymbol &&
      password.length >= 20 &&
      entropy >= 60;
    const result = isStrongPassword(password);
    expect(result).toBe(shouldBeValid);
  }
});
