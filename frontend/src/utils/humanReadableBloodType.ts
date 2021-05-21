const regex = /[ABO]{1,2}_RH_(PLUS|MINUS)/.compile();

export default function humanReadableBloodType(type: string): string {
  if (!regex.test(type)) return type;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [group, _, plusOrMinus] = type.split("_");
  return `${group}Rh${plusOrMinus === "PLUS" ? "+" : "-"}`;
}
