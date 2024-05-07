export default function filterWhere<TType>(
  DTO: TType[],
  where: Record<keyof TType, TType[keyof TType]>
) {
  return DTO.filter((field) => {
    for (const [key, value] of Object.entries(where)) {
      const dtoField = field[key as keyof TType];
      if (typeof value === 'string') {
        const match = dtoField
          ?.toString()
          .toLocaleLowerCase()
          .includes(value.toLocaleLowerCase());

        if (match) return true;
      }
    }
    return false;
  });
}
