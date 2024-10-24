import type { Company } from "../types.ts";

export default function CompaniesList(props: {
  companies: Partial<Company>[];
}) {
  return (
    <div>
      {props.companies.map((c) => {
        return (
          <div>
            <a href={`/${c.ticker}`}>
              {c.name} ({c.ticker})
            </a>
          </div>
        );
      })}
    </div>
  );
}
