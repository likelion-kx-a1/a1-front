import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Prettier와 충돌하는 ESLint 포맷 규칙 비활성화
  prettier,
  {
    // 팀 커스텀 규칙
    rules: {
      // console.log는 경고, warn/error는 허용
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // 안 쓰는 변수 경고, _ 접두사는 의도적 미사용으로 예외 처리
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      eqeqeq: ["error", "always"],
      // if, for 등에서 중괄호 항상 사용 (버그 방지)
      curly: ["error", "all"],
      // 객체 축약 문법 강제: { foo }
      "object-shorthand": ["error", "always"],
      // JSX에서 불필요한 중괄호 제거: disabled={true} → disabled
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      // Next.js <img> 사용 경고 비활성화
      "@next/next/no-img-element": "off",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
