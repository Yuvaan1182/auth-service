import { describe, expect, it } from "vitest";
import { registerSchema } from "#schema/auth.schema.js";

describe("Registration Schema Validation", () => {
  it("should pass with valid data", () => {
    const payload = {
      body: {
        email: "test@mail.com",
        password: "testpassword",
        name: "admin test",
      },
    };

    const result = registerSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("should fail if email is INVALID", () => {
    const payload = {
      body: {
        email: "test",
        password: "newpassword",
        name: "text name",
      },
    };

    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("email"));
      expect(error).toBeDefined();
      expect(error?.message).toBe("Invalid email address");
    }
  });

  it("should fail if email is not provided", () => {
    const payload = {
      body: {
        password: "newpassword",
        name: "text name",
      },
    };
    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("email"));
      expect(error).toBeDefined();
      expect(error?.message).toBe("Invalid email address");
    }
  });

  it("should fail if password is less than 8 char", () => {
    const payload = {
      body: {
        email: "test@mail.com",
        password: "newpas",
        name: "text name",
      },
    };
    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("password"),
      );
      expect(error).toBeDefined();
      expect(error?.message).toBe("Password must be atleast 8 characters.");
    }
  });

  it("should fail if password is greater than 30 char", () => {
    const payload = {
      body: {
        email: "test@mail.com",
        password:
          "newpasfj20q8ur34089jflsakjfq028rj2q0ur[0q29u345r0923u5023u9r-091`2=i'pF;'FJASDJFSLDIAJFLKSDAjF KSLAJFLSAJFSJFLKSADJFWJR9W34JRHFOIDFJ",
        name: "text name",
      },
    };
    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("password"),
      );
      expect(error).toBeDefined();
      expect(error?.message).toBe("Password cannot exceed 30 characters.");
    }
  });

  it("should fail if password is missing", () => {
    const payload = {
      body: {
        email: "test@mail.com",
        name: "text name",
      },
    };
    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("password"),
      );
      expect(error).toBeDefined();
      expect(error?.message).toBe(
        "Invalid input: expected string, received undefined",
      );
    }
  });

  it("should fail if password is not string", () => {
    const payload = {
      body: {
        email: "test@mail.com",
        password: 1321314141234,
        name: "text name",
      },
    };
    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("password"),
      );
      expect(error).toBeDefined();
      expect(error?.message).toBe(
        "Invalid input: expected string, received number",
      );
    }
  });

  it("should fail if name is less than 2 char", () => {
    const payload = {
      body: {
        email: "test@mail.com",
        password: "password",
        name: "t",
      },
    };
    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("name"));
      expect(error).toBeDefined();
      expect(error?.message).toBe("Name must be atleast 2 characters.");
    }
  });
  it("should fail if name is greater 100 char", () => {
    const payload = {
      body: {
        email: "test@mail.com",
        password: "password",
        name: `tlkjfals;jfwaiejfl;sdakfjls;adkfj;asdjf 
                lsakjflkjsad lkfjlksdajfiwasjflsdifja;if jasdifjnia 
                jsndfiajnsfi;lewifjnsad;lfnasd;lfjwailjfdsaifjowaisejfisdnf;lasjdfasd;lkfji;ewajfs;kadlj
                f;iasjfieajflsidjfa;jefijfa;slfij;alsijfe;lafija;slfje;aslfija;eslijfa;slfj;asfj`,
      },
    };
    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("name"));
      expect(error).toBeDefined();
      expect(error?.message).toBe("Name cannot exceed 100 characters.");
    }
  });
  it("should fail if name is missing", () => {
    const payload = {
      body: {
        email: "test@mail.com",
        password: "password",
      },
    };
    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("name"));
      expect(error).toBeDefined();
      expect(error?.message).toBe(
        "Invalid input: expected string, received undefined",
      );
    }
  });
  it("should fail if name is not string", () => {
    const payload = {
      body: {
        email: "test@mail.com",
        password: "password",
        name: 12131231431,
      },
    };
    const result = registerSchema.safeParse(payload);

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("name"));
      expect(error).toBeDefined();
      expect(error?.message).toBe(
        "Invalid input: expected string, received number",
      );
    }
  });
});
