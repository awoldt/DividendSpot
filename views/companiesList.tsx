import type { Company } from "../types.ts";

export default function CompaniesList(props: {
  companies: Partial<Company>[];
}) {
  return (
    <div>
      {props.companies.map((c) => {
        return (
          <div>
            {c.name} ({c.ticker})
          </div>
        );
      })}
    </div>
  );
}
